<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSchoolApplicationRequest;
use App\Models\Admin;
use App\Models\Document;
use App\Models\School;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('schools/apply');
    }

    public function validateSchool(StoreSchoolApplicationRequest $request)
    {
        $data = $request->validated();
        
        // Handle School Logo temporarily
        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('temp/logos', 'public');
            unset($data['logo']);
        }

        // Handle Documents temporarily
        if (isset($data['documents'])) {
            foreach ($data['documents'] as $key => $doc) {
                if (isset($doc['file'])) {
                    $data['documents'][$key]['file_path'] = $doc['file']->store('temp/documents', 'public');
                    unset($data['documents'][$key]['file']);
                }
            }
        }

        session(['school_registration_data' => $data]);

        return redirect()->route('register.select-plan');
    }

    public function selectPlan()
    {
        if (!session()->has('school_registration_data')) {
            return redirect()->route('register.index');
        }

        return Inertia::render('schools/select-subscription-plan', [
            'subscriptionPlans' => \App\Models\SubscriptionPlan::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'subscription_plan_id' => ['required', 'exists:subscription_plans,id'],
            'payment_method' => ['required', 'in:online,reference_number'],
        ]);

        $regData = session('school_registration_data');
        if (!$regData) {
            return redirect()->route('register.index')->withErrors(['error' => 'انتهت صلاحية الجلسة، يرجى إعادة إدخال البيانات.']);
        }

        try {
            return DB::transaction(function () use ($regData, $request) {
                // 1. Move Logo from temp to final
                $logoPath = $regData['logo_path'] ?? null;
                if ($logoPath) {
                    $newLogoPath = str_replace('temp/logos', 'schools/logos', $logoPath);
                    if (\Illuminate\Support\Facades\Storage::disk('public')->exists($logoPath)) {
                        \Illuminate\Support\Facades\Storage::disk('public')->move($logoPath, $newLogoPath);
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
                    'current_plan_id' => $request->subscription_plan_id,
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
                        if ($tempPath && \Illuminate\Support\Facades\Storage::disk('public')->exists($tempPath)) {
                            $finalPath = str_replace('temp/documents', 'documents/schools/'.$school->id, $tempPath);
                            \Illuminate\Support\Facades\Storage::disk('public')->move($tempPath, $finalPath);
                            
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
                $plan = \App\Models\SubscriptionPlan::find($request->subscription_plan_id);
                $paymentService = new \App\Services\PaymentService();
                
                if ($plan->price <= 0) {
                    $school->update(['subscription_status' => 'active']);
                    
                    // Create a "free" payment record for history
                    $payment = \App\Models\Payment::create([
                        'school_id' => $school->id,
                        'payment_method' => 'online',
                        'amount' => 0,
                        'status' => 'pending',
                        'transaction_id' => 'FREE_' . \Illuminate\Support\Str::random(10),
                    ]);
                    
                    $paymentService->completePayment($payment);
                    
                    session()->forget('school_registration_data');
                    return redirect()->route('welcome')->with('success', 'تم تفعيل حسابكم المجاني بنجاح! تفضل بالدخول إلى لوحة التحكم.');
                }

                if ($request->payment_method === 'online') {
                    $result = $paymentService->initiateOnlinePayment($school, (float)$plan->price);
                } else {
                    $result = $paymentService->generateReferenceNumber($school, (float)$plan->price);
                }

                // Clear session
                session()->forget('school_registration_data');

                // Redirect based on payment method
                if ($request->payment_method === 'online') {
                    return Inertia::location($result['checkout_url']);
                }

                return redirect()->route('register.index')->with('success', 'تم تسجيل طلبكم بنجاح. رقم المرجع للدفع: ' . $result['reference_number'] . '. سيتم تفعيل حسابكم فور تأكيد الدفع.');
            });
        } catch (\Exception $e) {
            Log::error('Registration checkout error: '.$e->getMessage());
            return back()->withErrors(['error' => 'حدث خطأ أثناء إتمام عملية التسجيل: ' . $e->getMessage()]);
        }
    }

    public function store(StoreSchoolApplicationRequest $request)
    {
        // Keep original store for compatibility if needed, or redirect it to multi-step
        return $this->validateSchool($request);
    }
}
