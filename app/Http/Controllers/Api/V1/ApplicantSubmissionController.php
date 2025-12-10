<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Applicant;
use App\Http\Controllers\Api\V1\ApiController;

class ApplicantSubmissionController extends ApiController
{
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->teacher || $user->student) {
            return $this->error('You already have an active role and cannot submit a new application.', 422);
        }

        $existingApplication = Applicant::where('user_id', $user->id)->whereIn('status', ['pending', 'under_review'])->exists();
        if ($existingApplication) {
            return $this->error('You already have an open application.', 422);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'application_type' => 'required|in:teacher,student',
            'bio' => 'required|string',
            'qualifications' => 'required|string',
            'school_id' => 'nullable|exists:schools,id',
            'memorization_level' => 'sometimes|integer|between:0,30',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed.', 422, $validator->errors());
        }

        $applicant = Applicant::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'email' => $request->email,
            'application_type' => $request->application_type,
            'bio' => $request->bio,
            'qualifications' => $request->qualifications,
            'school_id' => $request->school_id,
            'memorization_level' => $request->input('memorization_level', 0),
            'status' => 'pending',
            'submitted_at' => now(),
        ]);

        return $this->success($applicant, 'Application submitted successfully.', 201);
    }
}
