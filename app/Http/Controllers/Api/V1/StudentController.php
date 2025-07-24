<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Repositories\StudentRepository;
use App\Repositories\StudentApplicantRepository;
use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Http\Requests\Student\AssignHalaqaRequest;
use App\Http\Requests\Student\ActionRequest;
use App\Http\Requests\Student\FollowUpRequest;
use App\Http\Resources\StudentResource;
use App\Http\Resources\StudentApplicantResource;
use App\Http\Resources\FollowUpResource;
use App\Http\Requests\PlanRequest;
use App\Http\Requests\TrackingRequest;
use App\Http\Requests\TrackingDetailRequest;
use App\Http\Resources\PlanResource;
use App\Http\Resources\TrackingResource;
use App\Http\Resources\TrackingDetailResource;
use App\Http\Resources\StudentSyncResource;

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
        $students = $this->students->all($request->all());
        // return $students;
        if (method_exists($students, 'total')) {
            return $this->paginated(StudentResource::collection($students));
        }
        return $this->success(StudentResource::collection($students));
    }

    public function show($id)
    {
        $student = $this->students->find($id);
        return $this->success(new StudentSyncResource($student));
    }

    public function update(UpdateStudentRequest $request, $id)
    {

        $student = $this->students->update($id, $request->validated());
        return $this->success(new StudentResource($student), 'Student updated successfully.');
    }

    public function assign(AssignHalaqaRequest $request, $id)
    {
        try {
            $student = \App\Models\Student::findOrFail($id);
            $halaqaId = $request->halaqaId;
            $studentId = $request->studentId;
            \App\Models\Enrollment::firstOrCreate([
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
            $student = \App\Models\Student::findOrFail($id);
            $action = $request->action;
            if ($action === 'suspend') {
                $student->status = 'suspended';
            } elseif ($action === 'expel') {
                $student->status = 'expelled';
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
            // Minimal logic: return a fake plan for the student
            $student = \App\Models\Student::findOrFail($id);
            return $this->success(new FollowUpResource((object)[
                'id' => 15,
                'frequency' => 'daily',
                'details' => [
                    ['type' => 'memorization', 'unit' => 'page', 'amount' => 2],
                    ['type' => 'review', 'unit' => 'juz', 'amount' => 1],
                    ['type' => 'recitation', 'unit' => 'page', 'amount' => 2],
                ],
                'updated_at' => now(),
                'created_at' => now(),
            ]));
        } catch (\Throwable $e) {
            Log::error($e);
            return $this->error('Failed to get follow-up', 500, $e->getMessage());
        }
    }

    public function updateFollowUp(FollowUpRequest $request, $id)
    {
        // Implement update follow-up logic in repository/service
        return $this->success(new FollowUpResource((object)[
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
        return $this->success(PlanResource::collection($plans));
    }

    public function getActivePlan($studentId)
    {
        $plan = $this->students->getActivePlan($studentId);
        return $this->success($plan ? new PlanResource($plan) : null);
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

    public function createTracking(TrackingRequest $request, $planId)
    {
        $tracking = $this->students->createTracking($planId, $request->validated());
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
