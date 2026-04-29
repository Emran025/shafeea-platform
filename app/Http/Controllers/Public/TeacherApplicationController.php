<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;

use App\Http\Requests\StoreTeacherApplicationRequest;
use App\Models\School;
use App\Services\ApplicantService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TeacherApplicationController extends Controller
{
    protected $applicantService;

    public function __construct(ApplicantService $applicantService)
    {
        $this->applicantService = $applicantService;
    }

    public function create()
    {
        $schools = cache()->remember('schools_list', 3600, function () {
            return School::select('id', 'name')->get();
        });

        return Inertia::render('teachers/apply', [
            'schools' => $schools,
        ]);
    }

    public function store(StoreTeacherApplicationRequest $request)
    {
        try {
            $this->applicantService->createTeacherApplication(
                $request->validated(),
                $request->file('documents', [])   // ← files must come separately from validated()
            );

            return redirect()->route('teachers.apply')
                ->with('success', 'تم تقديم طلبك بنجاح! سيتم مراجعة الطلب وإشعارك بالنتيجة عبر البريد الإلكتروني.');
        } catch (\Exception $e) {
            Log::error('Teacher application error: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['password', 'password_confirmation']),
            ]);

            return back()->withErrors([
                'error' => 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.',
            ])->withInput();
        }
    }
}
