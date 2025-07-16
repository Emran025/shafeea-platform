<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Enrollment;
use App\Models\Plan;
use App\Models\Halaqah;

class StudentController extends ApiController
{
    // GET /students
    public function index(Request $request)
    {
        $query = Student::with(['user', 'enrollments.halaqah']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $query->orderBy(
            $request->input('sortBy', 'created_at'),
            $request->input('sortOrder', 'desc')
        );

        $students = $query->paginate(
            $request->input('limit', 10),
            ['*'],
            'page',
            $request->input('page', 1)
        );

        return $this->paginated($students);
    }

    // GET /students/{id}
    public function show($id)
    {
        $student = Student::with([
            'user',
            'enrollments.halaqah',
            'enrollments.plan',
        ])->findOrFail($id);

        return $this->success($student);
    }

    // PUT /students/{id}
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $student->update($request->only([
            'qualification',
            'memorization_level',
            'status',
        ]));

        // إذا كنت تريد تحديث بيانات المستخدم المرتبطة أيضًا:
        if ($request->has('user')) {
            $student->user->update($request->input('user'));
        }

        return $this->success($student->load('user'), "Student with ID {$id} updated.");
    }

    // GET /students/{id}/follow-up
    public function getFollowUp($id)
    {
        $enrollment = Enrollment::with('plan')
            ->where('student_id', $id)
            ->latest('enrolled_at')
            ->first();

        if (!$enrollment || !$enrollment->plan) {
            return $this->error("No active plan found for student {$id}", 404);
        }

        return $this->success([
            'plan_id' => $enrollment->plan->id,
            'frequency' => $enrollment->plan->frequencyType?->name,
            'details' => [
                [
                    'type' => 'memorization',
                    'unit' => $enrollment->plan->memorizationUnit?->name,
                    'amount' => $enrollment->plan->memorization_amount,
                ],
                [
                    'type' => 'review',
                    'unit' => $enrollment->plan->reviewUnit?->name,
                    'amount' => $enrollment->plan->review_amount,
                ],
                [
                    'type' => 'sard',
                    'unit' => $enrollment->plan->sardUnit?->name,
                    'amount' => $enrollment->plan->sard_amount,
                ],
            ],
            'createdAt' => $enrollment->plan->created_at,
            'updatedAt' => $enrollment->plan->updated_at,
        ]);
    }

    // PUT /students/{id}/follow-up
    public function updateFollowUp(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        // إنشاء خطة جديدة
        $plan = Plan::create([
            'name' => 'Custom Plan for Student ' . $student->id,
            'start_date' => now(),
            'end_date' => null,
            'has_memorization' => true,
            'memorization_unit_id' => $request->input('memorization_unit_id'),
            'memorization_amount' => $request->input('memorization_amount'),
            'has_review' => true,
            'review_unit_id' => $request->input('review_unit_id'),
            'review_amount' => $request->input('review_amount'),
            'has_sard' => true,
            'sard_unit_id' => $request->input('sard_unit_id'),
            'sard_amount' => $request->input('sard_amount'),
            'frequency_type_id' => $request->input('frequency_type_id'),
        ]);

        // إنشاء تسجيل ارتباط بالخطة
        Enrollment::create([
            'student_id' => $student->id,
            'halaqah_id' => $request->input('halaqah_id'), // قد تكون نفس القديمة أو جديدة
            'enrolled_at' => now(),
            'plan_id' => $plan->id,
        ]);

        return $this->success($plan->load(['memorizationUnit', 'reviewUnit', 'sardUnit']), "Follow-up plan updated.");
    }

    // POST /students/{id}/assign
    public function assignToHalaqa(Request $request, $id)
    {
        $request->validate([
            'halaqah_id' => 'required|exists:halaqahs,id',
        ]);

        $enrollment = Enrollment::create([
            'student_id' => $id,
            'halaqah_id' => $request->input('halaqah_id'),
            'enrolled_at' => now(),
        ]);

        return $this->success($enrollment, "Student {$id} assigned to Halaqah {$request->halaqah_id}");
    }

    // POST /students/{id}/actions
    public function takeAction(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:active,suspended,expelled,dropout',
        ]);

        $student = Student::findOrFail($id);
        $student->status = $request->action;
        $student->save();

        return $this->success(null, "Student {$id} status updated to {$request->action}");
    }
}
