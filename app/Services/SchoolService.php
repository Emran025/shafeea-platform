<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\Document;
use App\Models\School;
use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SchoolService
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function processRegistrationData(array $data, $logoFile = null, array $documentsFiles = [])
    {
        if ($logoFile) {
            $data['logo_path'] = $logoFile->store('temp/logos', 'public');
        }

        if (isset($data['documents'])) {
            foreach ($data['documents'] as $key => $doc) {
                if (isset($documentsFiles[$key]['file'])) {
                    $data['documents'][$key]['file_path'] = $documentsFiles[$key]['file']->store('temp/documents', 'public');
                }
            }
        }

        return $data;
    }

    public function registerSchool(array $regData, int $subscriptionPlanId, string $paymentMethod)
    {
        return DB::transaction(function () use ($regData, $subscriptionPlanId, $paymentMethod) {
            // 1. Move Logo from temp to final
            $logoPath = $regData['logo_path'] ?? null;
            if ($logoPath) {
                $newLogoPath = str_replace('temp/logos', 'schools/logos', $logoPath);
                if (Storage::disk('public')->exists($logoPath)) {
                    Storage::disk('public')->move($logoPath, $newLogoPath);
                    $logoPath = $newLogoPath;
                }
            }

            // 2. Create School
            $school = School::create([
                'name' => $regData['name'],
                'phone' => $regData['phone'],
                'country' => $regData['country'],
                'city' => $regData['city'],
                'location' => $regData['location'],
                'address' => $regData['address'],
                'logo' => $logoPath,
                'current_plan_id' => $subscriptionPlanId,
                'subscription_status' => 'pending_payment',
            ]);

            // 3. Create User
            $user = User::create([
                'name' => $regData['admin_name'],
                'email' => $regData['admin_email'],
                'phone' => $regData['admin_phone'],
                'password' => Hash::make($regData['admin_password']),
                'school_id' => $school->id,
            ]);

            // 4. Handle Documents
            if (isset($regData['documents']) && is_array($regData['documents'])) {
                foreach ($regData['documents'] as $doc) {
                    $tempPath = $doc['file_path'] ?? null;
                    if ($tempPath && Storage::disk('public')->exists($tempPath)) {
                        $finalPath = str_replace('temp/documents', 'documents/schools/'.$school->id, $tempPath);
                        Storage::disk('public')->move($tempPath, $finalPath);
                        
                        Document::create([
                            'user_id' => $user->id,
                            'name' => $doc['name'],
                            'certificate_type' => $doc['certificate_type'],
                            'certificate_type_other' => $doc['certificate_type_other'] ?? null,
                            'riwayah' => $doc['riwayah'] ?? null,
                            'issuing_place' => $doc['issuing_place'] ?? null,
                            'issuing_date' => $doc['issuing_date'] ?? null,
                            'file_path' => $finalPath,
                        ]);
                    }
                }
            }

            Admin::create([
                'user_id' => $user->id,
                'school_id' => $school->id,
                'status' => 'pending',
            ]);

            // 5. Plan Activation / Payment Initiation
            $plan = SubscriptionPlan::findOrFail($subscriptionPlanId);
            
            if ($plan->price <= 0) {
                $school->update(['subscription_status' => 'active']);
                
                $payment = Payment::create([
                    'school_id' => $school->id,
                    'payment_method' => 'online',
                    'amount' => 0,
                    'status' => 'pending',
                    'transaction_id' => 'FREE_' . Str::random(10),
                ]);
                
                $this->paymentService->completePayment($payment);
                
                return [
                    'type' => 'free',
                    'school' => $school,
                ];
            }

            if ($paymentMethod === 'online') {
                $result = $this->paymentService->initiateOnlinePayment($school, (float)$plan->price);
                return [
                    'type' => 'online',
                    'checkout_url' => $result['checkout_url'],
                    'school' => $school,
                ];
            } else {
                $result = $this->paymentService->generateReferenceNumber($school, (float)$plan->price);
                return [
                    'type' => 'reference',
                    'reference_number' => $result['reference_number'],
                    'school' => $school,
                ];
            }
        });
    }
}
