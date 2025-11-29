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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AdminApplicantController extends ApiController
{
    public function index(Request $request)
    {
        $admin = $request->user();
        $adminSchoolId = $admin->school_id;

        // Get user IDs of all existing students and teachers to exclude them.
        $studentUserIds = Student::pluck('user_id');
        $teacherUserIds = Teacher::pluck('user_id');
        $acceptedUserIds = $studentUserIds->merge($teacherUserIds)->unique();

        $query = Applicant::query()->with('user')
            // 1. Exclude applicants who are already students or teachers.
            ->whereNotIn('user_id', $acceptedUserIds)
            // 2. Exclude applicants rejected by the current admin's school.
            ->whereDoesntHave('rejections', function ($q) use ($adminSchoolId) {
                $q->where('school_id', $adminSchoolId);
            })
            // 3. Include applicants assigned to the admin's school or available to all.
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

                        'qualification' => $applicant->qualifications,
                        'memorization_level' => $applicant->memorization_level,
                    ]);
                }

                // Assign the user to the admin's school
                $applicant->user()->update(['school_id' => $adminSchoolId, 'status' => 'Inactive']);
            });
        } catch (\Exception $e) {
            Log::error('Approval Error: ' . $e->getMessage());
            return $this->error('An error occurred during the approval process.' . $e->getMessage(), 500);
        }

        return $this->success($applicant->fresh(), 'Applicant approved and assigned to your school.');
    }

    public function reject(Request $request, $id)
    {
        $admin = $request->user();
        $adminSchoolId = $admin->school_id;

        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:1000',
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

        if ($applicant->status === 'approved') {
            return $this->error('This applicant has already been approved and cannot be rejected.', 422);
        }

        if ($applicant->status !== 'pending' && $applicant->status !== 'under_review') {
            return $this->error('Only pending or under_review applications can be rejected.', 422);
        }

        // Check if the school has already rejected this applicant
        if ($applicant->rejections()->where('school_id', $adminSchoolId)->exists()) {
            return $this->error('This applicant has already been rejected by your school.', 422);
        }

        try {
            DB::transaction(function () use ($applicant, $adminSchoolId, $request) {
                $applicant->rejections()->create([
                    'school_id' => $adminSchoolId,
                    'reason' => $request->reason,
                ]);

                $applicant->update([
                    'school_id' => null,
                    'status' => 'pending', // Reset status
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Rejection Error: ' . $e->getMessage());
            return $this->error('An error occurred during the rejection process.', 500);
        }

        return $this->success(null, 'Applicant rejected and returned to the general pool.');
    }
}
