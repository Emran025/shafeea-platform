<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;

use App\Http\Requests\Teacher\StoreTeacherApplicationRequest;
use App\Models\School\School;
use App\Services\Applicant\ApplicantService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TeacherApplicationController extends Controller
{
    protected $applicantService;

    public function __construct(ApplicantService $applicantService)
    {
        $this->applicantService = $applicantService;
    }

    public function create(Request $request)
    {
        $schoolParam = $request->query('school');
        $selectedSchool = null;

        if ($schoolParam) {
            $selectedSchool = School::where(function ($query) use ($schoolParam) {
                $query->where('school_code', $schoolParam)
                    ->orWhere('name', $schoolParam);

                if (is_numeric($schoolParam)) {
                    $query->orWhere('id', (int) $schoolParam);
                }
            })->first();
        }

        $schools = cache()->remember('schools_list_with_logo', 3600, function () {
            return School::select('id', 'name', 'logo')->get();
        });

        return Inertia::render('teachers/apply', [
            'schools' => $schools,
            'selected_school' => $selectedSchool ? [
                'id' => $selectedSchool->id,
                'name' => $selectedSchool->name,
                'logo' => $selectedSchool->logo,
            ] : null,
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
            Log::error('Teacher application error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'request_data' => $request->except(['user_password', 'user_password_confirmation']),
            ]);

            return back()->withErrors([
                'error' => 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.',
            ])->withInput();
        }
    }
}
