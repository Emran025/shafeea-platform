<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\ApiController;
use App\Http\Requests\StoreStudentApplicantRequest;
use App\Models\StudentApplicant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentApplicantController extends ApiController
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentApplicantRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'avatar' => $request->avatar,
                'phone' => $request->phone,
                'phone_zone' => $request->phone_zone,
                'whatsapp' => $request->whatsapp,
                'whatsapp_zone' => $request->whatsapp_zone,
                'gender' => $request->gender,
                'birth_date' => $request->birth_date,
                'country' => $request->country,
                'city' => $request->city,
                'residence' => $request->residence,
            ]);

            $applicant = StudentApplicant::create([
                'user_id' => $user->id,
                'school_id' => $request->school_id,
                'application_type' => 'student',
                'status' => 'pending',
                'bio' => $request->bio,
                'qualifications' => $request->qualifications,
                'memorization_level' => $request->input('memorization_level', 0),
                'submitted_at' => now(),
            ]);

            DB::commit();

            return $this->success($applicant, 'Application submitted successfully.', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('An error occurred while submitting the application.', 500, ['error' => $e->getMessage()]);
        }
    }
}
