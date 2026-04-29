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
        // --- Handle Logo ---
        if ($logoFile instanceof \Illuminate\Http\UploadedFile && $logoFile->isValid()) {
            $data['school_logo_path'] = $logoFile->store('temp/logos', 'public');
        }
        // Always remove the raw file object — it cannot be serialized into the session
        unset($data['school_logo']);

        // --- Handle Documents ---
        // IMPORTANT: $request->validated() NEVER populates nested file fields (documents.*.file)
        // with UploadedFile instances. Files must come from $request->file('documents').
        // $documentsFiles structure: [ 0 => ['file' => UploadedFile], 1 => ['file' => UploadedFile], ... ]
        if (isset($data['documents']) && is_array($data['documents'])) {
            foreach ($data['documents'] as $key => $doc) {
                // Always clear the file key — it won't be a real UploadedFile from validated()
                unset($data['documents'][$key]['file']);

                // Grab the actual file from the dedicated $documentsFiles array
                $uploadedFile = $documentsFiles[$key]['file'] ?? null;

                if ($uploadedFile instanceof \Illuminate\Http\UploadedFile && $uploadedFile->isValid()) {
                    $data['documents'][$key]['file_path'] = $uploadedFile->store('temp/documents', 'public');
                } else {
                    // No file for this document — mark explicitly so registerSchool can handle it
                    $data['documents'][$key]['file_path'] = null;
                }
            }
        }

        return $data;
    }

    public function registerSchool(array $regData, int $subscriptionPlanId, string $paymentMethod)
    {
        return DB::transaction(function () use ($regData, $subscriptionPlanId, $paymentMethod) {
            // 1. Move Logo from temp to final
            $logoPath = $regData['school_logo_path'] ?? null;
            if ($logoPath) {
                $newLogoPath = str_replace('temp/logos', 'schools/logos', $logoPath);
                if (Storage::disk('public')->exists($logoPath)) {
                    Storage::disk('public')->move($logoPath, $newLogoPath);
                    $logoPath = $newLogoPath;
                }
            }

            // 2. Create School
            $school = School::create([
                'name' => $regData['school_name'],
                'phone' => $regData['school_phone'],
                'country' => $regData['school_country'],
                'city' => $regData['school_city'],
                'location' => $regData['school_location'],
                'address' => $regData['school_address'],
                'logo' => $logoPath,
                'current_plan_id' => $subscriptionPlanId,
                'subscription_status' => 'pending_payment',
            ]);

            // 3. Create User
            $user = User::create([
                'name' => $regData['user_name'],
                'email' => $regData['user_email'],
                'phone' => $regData['user_phone'],
                'country' => $regData['school_country'], // School and Admin usually share location
                'city' => $regData['school_city'],
                'password' => Hash::make($regData['user_password']),
                'school_id' => $school->id,
            ]);

            // 4. Handle Documents
            if (isset($regData['documents']) && is_array($regData['documents'])) {
                foreach ($regData['documents'] as $doc) {
                    // Resolve the final file path (move from temp if it exists)
                    $finalPath = null;
                    $tempPath = $doc['file_path'] ?? null;

                    if ($tempPath) {
                        if (Storage::disk('public')->exists($tempPath)) {
                            $finalPath = str_replace('temp/documents', 'documents/schools/' . $school->id, $tempPath);
                            Storage::disk('public')->move($tempPath, $finalPath);
                        } else {
                            // Temp file is gone (e.g. between deployments) — keep path as-is so admin knows a file was submitted
                            $finalPath = $tempPath;
                        }
                    }

                    // Always save the document record, even if no file was uploaded
                    // Text metadata (name, type, date) must never be lost
                    if (!empty($doc['name']) || !empty($doc['certificate_type'])) {
                        Document::create([
                            'user_id'                => $user->id,
                            'name'                   => $doc['name'] ?? '',
                            'certificate_type'       => $doc['certificate_type'] ?? '',
                            'certificate_type_other' => $doc['certificate_type_other'] ?? null,
                            'riwayah'                => $doc['riwayah'] ?? null,
                            'issuing_place'          => $doc['issuing_place'] ?? null,
                            'issuing_date'           => $doc['issuing_date'] ?? null,
                            'file_path'              => $finalPath,
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
