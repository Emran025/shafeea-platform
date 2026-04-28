<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;

use App\Http\Requests\StoreSchoolApplicationRequest;
use App\Models\School;
use App\Models\SubscriptionPlan;
use App\Services\SchoolService;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolApplicationController extends Controller
{
    protected $schoolService;

    public function __construct(SchoolService $schoolService)
    {
        $this->schoolService = $schoolService;
    }

    public function create()
    {
        return Inertia::render('schools/apply');
    }

    public function validateSchool(StoreSchoolApplicationRequest $request)
    {
        $data = $this->schoolService->processRegistrationData(
            $request->validated(),
            $request->file('school_logo'),
            $request->file('documents', [])
        );

        session(['school_registration_data' => $data]);

        return redirect()->route('register.select-plan');
    }

    public function selectPlan()
    {
        if (!session()->has('school_registration_data')) {
            return redirect()->route('register.index');
        }

        return Inertia::render('schools/select-subscription-plan', [
            'subscriptionPlans' => SubscriptionPlan::where('is_active', true)->orderBy('sort_order')->get(),
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
            $result = $this->schoolService->registerSchool(
                $regData,
                (int)$request->subscription_plan_id,
                $request->payment_method
            );

            // Clear session
            session()->forget('school_registration_data');

            if ($result['type'] === 'free') {
                return redirect()->route('welcome')->with('success', 'تم تفعيل حسابكم المجاني بنجاح! تفضل بالدخول إلى لوحة التحكم.');
            }

            if ($result['type'] === 'online') {
                return Inertia::location($result['checkout_url']);
            }

            return redirect()->route('register.index')->with('success', 'تم تسجيل طلبكم بنجاح. رقم المرجع للدفع: ' . $result['reference_number'] . '. سيتم تفعيل حسابكم فور تأكيد الدفع.');
            
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
