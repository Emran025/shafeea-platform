<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Http\Resources\AdminApplicantResource;
use App\Models\Applicant;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminApplicantController extends ApiController
{
    public function index(Request $request)
    {
        $admin = $request->user();
        $adminSchoolId = $admin->school_id;

        $query = Applicant::query()->with('user')
            ->where(function ($q) use ($adminSchoolId) {
                $q->where('school_id', $adminSchoolId)
                    ->orWhereNull('school_id');
            });

        if ($request->has('application_type')) {
            $query->where('application_type', $request->application_type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $applicants = $query->paginate(15);

        return $this->success(AdminApplicantResource::collection($applicants));
    }

    public function show(Request $request, $id)
    {
        $admin = $request->user();
        $adminSchoolId = $admin->school_id;

        $applicant = Applicant::with('user')->find($id);

        if (!$applicant) {
            return $this->error('Applicant not found.', 404);
        }

        // Check if admin is authorized to view this applicant
        if ($applicant->school_id !== null && $applicant->school_id != $adminSchoolId) {
            return $this->error('You are not authorized to view this applicant.', 403);
        }

        return $this->success($applicant, 'Applicant retrieved successfully.');
    }

    public function approve(Request $request, $id)
    {
        $admin = $request->user();
        $adminSchoolId = $admin->school_id;

        $applicant = Applicant::find($id);

        if (!$applicant) {
            return $this->error('Applicant not found.', 404);
        }

        // Check if admin is authorized to approve this applicant
        if ($applicant->school_id !== null && $applicant->school_id != $adminSchoolId) {
            return $this->error('You are not authorized to approve this applicant.', 403);
        }

        if ($applicant->status !== 'pending' && $applicant->status !== 'under_review') {
            return $this->error('Only pending or under_review applications can be approved.', 422);
        }

        try {
            DB::transaction(function () use ($applicant, $adminSchoolId) {
                $applicant->update(['status' => 'approved']);

                if ($applicant->application_type === 'teacher') {
                    Teacher::create([
                        'user_id' => $applicant->user_id,
                        'bio' => $applicant->bio,
                    ]);
                } else {
                    Student::create([
                        'user_id' => $applicant->user_id,
                        'bio' => $applicant->bio,
                    ]);
                }

                // Assign the user to the admin's school
                $applicant->user()->update(['school_id' => $adminSchoolId]);
            });
        } catch (\Exception $e) {
            \Log::error('Approval Error: ' . $e->getMessage());
            return $this->error('An error occurred during the approval process.', 500);
        }

        return $this->success($applicant->fresh(), 'Applicant approved and assigned to your school.');
    }

    public function reject(Request $request, $id)
    {
        $admin = $request->user();
        $adminSchoolId = $admin->school_id;

        $validator = Validator::make($request->all(), [
            'rejection_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed.', 422, $validator->errors());
        }

        $applicant = Applicant::find($id);

        if (!$applicant) {
            return $this->error('Applicant not found.', 404);
        }

        // Check if admin is authorized to reject this applicant
        if ($applicant->school_id !== null && $applicant->school_id != $adminSchoolId) {
            return $this->error('You are not authorized to reject this applicant.', 403);
        }

        if ($applicant->status !== 'pending' && $applicant->status !== 'under_review') {
            return $this->error('Only pending or under_review applications can be rejected.', 422);
        }

        $applicant->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
        ]);

        return $this->success($applicant, 'Applicant rejected successfully.');
    }
}
