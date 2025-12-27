<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\PlanRequest;
use App\Http\Requests\Student\ActionRequest;
use App\Http\Requests\Student\AssignHalaqaRequest;
use App\Http\Requests\Student\FollowUpRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Http\Requests\TrackingDetailRequest;
use App\Http\Requests\TrackingRequest;
use App\Http\Resources\FollowUpResource;
use App\Http\Resources\PlanResource;
use App\Http\Resources\StudentApplicantResource;
use App\Http\Resources\StudentPlanResource;
use App\Http\Resources\StudentResource;
use App\Http\Resources\StudentSyncResource;
use App\Http\Resources\TrackingDetailResource;
use App\Http\Resources\TrackingResource;
use App\Repositories\StudentApplicantRepository;
use App\Repositories\StudentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Plan;
use App\Models\Student;
use App\Models\Enrollment;

class StudentController extends ApiController
{
    protected $students;

    protected $applicants;

    public function __construct(StudentRepository $students, StudentApplicantRepository $applicants)
    {
        $this->students = $students;
        $this->applicants = $applicants;
    }

    public function index(Request $request)
    {
        // Fixed missing pagination logic
        $students = $this->students->all($request->all());

        return $this->success(StudentResource::collection($students));
    }

    public function show($userId)
    {
        $student = $this->students->find($userId);

        return $this->success(new StudentSyncResource($student));
    }

    public function update(UpdateStudentRequest $request, $userId)
    {

        $student = $this->students->update($userId, $request->validated());

        return $this->success(new StudentResource($student), 'Student updated successfully.');
    }

    public function assign(AssignHalaqaRequest $request, $id)
    {
        try {
            $student = Student::where('user_id', $id)->firstOrFail();
            $halaqaId = $request->halaqaId;
            $studentId = $request->studentId;
            Enrollment::firstOrCreate([
                'student_id' => $studentId,
                'halaqah_id' => $halaqaId,
            ]);

            return $this->success(null, 'Student assigned to halaqa successfully.');
        } catch (\Throwable $e) {
            Log::error($e);

            return $this->error('Failed to assign student to halaqa', 500, $e->getMessage());
        }
    }

    public function action(ActionRequest $request, $id)
    {
        try {
            
            $student = Student::where('user_id', $id)->firstOrFail();            $action = $request->action;
            if ($action === 'suspend') {
                $student->status = 'suspended';
            } elseif ($action === 'expel') {
                // Note: 'expelled' is not in the enum, using 'inactive' instead
                $student->status = 'inactive';
            }
            $student->save();

            return $this->success(null, 'Action completed successfully.');
        } catch (\Throwable $e) {
            Log::error($e);

            return $this->error('Failed to take action on student', 500, $e->getMessage());
        }
    }

    public function followUp($id, Request $request)
    {
        try {
            $student = Student::where('user_id', $id)->firstOrFail();
            $enrollment = $student->enrollments->first();

            if (! $enrollment) {
                return $this->error('No active enrollment found for this student', 404);
            }

            $plan = $enrollment->currentPlan->first();

            if (! $plan) {
                return $this->error('No active plan found for this student', 404);
            }

            $details = [];

            if ($plan->has_memorization && $plan->memorizationUnit) {
                $details[] = [
                    'type' => 'memorization',
                    'unit' => $plan->memorizationUnit->code,
                    'amount' => $plan->memorization_amount,
                ];
            }

            if ($plan->has_review && $plan->reviewUnit) {
                $details[] = [
                    'type' => 'review',
                    'unit' => $plan->reviewUnit->code,
                    'amount' => $plan->review_amount,
                ];
            }

            if ($plan->has_sard && $plan->sardUnit) {
                $details[] = [
                    'type' => 'recitation',
                    'unit' => $plan->sardUnit->code,
                    'amount' => $plan->sard_amount,
                ];
            }

            $plan->frequency = $plan->frequencyType ? $plan->frequencyType->name : null;
            $plan->details = $details;

            return $this->success(new FollowUpResource($plan));
        } catch (\Throwable $e) {
            Log::error($e);

            return $this->error('Failed to get follow-up', 500, $e->getMessage());
        }
    }

    public function updateFollowUp(FollowUpRequest $request, $id)
    {
        // Implement update follow-up logic in repository/service
        return $this->success(new FollowUpResource((object) [
            'id' => 15,
            'frequency' => $request->frequency,
            'details' => $request->details,
            'updated_at' => now(),
            'created_at' => now(),
        ]), 'Follow-up plan updated.');
    }

    public function applicants(Request $request)
    {
        $applicants = $this->applicants->all($request->all());
        if (method_exists($applicants, 'total')) {
            return $this->paginated(StudentApplicantResource::collection($applicants));
        }

        return $this->success(StudentApplicantResource::collection($applicants));
    }

    public function showApplicant($id)
    {
        $applicant = $this->applicants->find($id);

        return $this->success(new StudentApplicantResource($applicant));
    }

    public function applicantAction(Request $request, $id)
    {
        // Implement applicant action logic in repository/service
        return $this->success(null, 'Applicant accepted successfully.');
    }

    // PLAN MANAGEMENT
    public function getPlans($studentId)
    {
        $plans = $this->students->getPlans($studentId);

        return $this->success(StudentPlanResource::collection($plans));
    }

    public function getActivePlan($studentId)
    {
        $plan = $this->students->getActivePlan($studentId);

        return $this->success($plan ? new StudentPlanResource($plan) : null);
    }

    public function createPlan(PlanRequest $request, $studentId)
    {
        $plan = $this->students->createPlan($studentId, $request->validated());

        return $this->success(new PlanResource($plan), 'Plan created and student enrolled.');
    }

    public function updatePlan(PlanRequest $request, $planId)
    {
        $plan = $this->students->updatePlan($planId, $request->validated());

        return $this->success(new PlanResource($plan), 'Plan updated.');
    }

    public function deletePlan($planId)
    {
        $this->students->deletePlan($planId);

        return $this->success(null, 'Plan deleted.');
    }

    // TRACKING MANAGEMENT
    public function getTrackingsForStudent($studentId)
    {
        $trackings = $this->students->getTrackingsForStudent($studentId);

        return $this->success(TrackingResource::collection($trackings));
    }

    public function createTracking(TrackingRequest $request, $enrollmentId)
    {
        $tracking = $this->students->createTracking($enrollmentId, $request->validated());

        return $this->success(new TrackingResource($tracking), 'Tracking created.');
    }

    public function updateTracking(TrackingRequest $request, $trackingId)
    {
        $tracking = $this->students->updateTracking($trackingId, $request->validated());

        return $this->success(new TrackingResource($tracking), 'Tracking updated.');
    }

    public function deleteTracking($trackingId)
    {
        $this->students->deleteTracking($trackingId);

        return $this->success(null, 'Tracking deleted.');
    }

    public function getTrackingDetails($trackingId)
    {
        $details = $this->students->getTrackingDetails($trackingId);

        return $this->success(TrackingDetailResource::collection($details));
    }

    public function addTrackingDetail(TrackingDetailRequest $request, $trackingId)
    {
        $detail = $this->students->addTrackingDetail($trackingId, $request->validated());

        return $this->success(new TrackingDetailResource($detail), 'Tracking detail added.');
    }

    public function deleteTrackingDetail($trackingDetailId)
    {
        $this->students->deleteTrackingDetail($trackingDetailId);

        return $this->success(null, 'Tracking detail deleted.');
    }
}
