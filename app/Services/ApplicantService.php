<?php

namespace App\Services;

use App\Models\Applicant;
use App\Models\Document;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\UploadedFile;

class ApplicantService
{
    public function createTeacherApplication(array $data)
    {
        return DB::transaction(function () use ($data) {
            // 1. Create User
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'country' => $data['country'] ?? null,
                'city' => $data['city'] ?? null,
                'password' => Hash::make($data['password']),
            ]);

            // 2. Create Applicant
            $applicant = Applicant::create([
                'user_id' => $user->id,
                'school_id' => $data['school_id'],
                'application_type' => 'teacher',
                'bio' => $data['bio'],
                'qualifications' => $data['qualifications'],
                'memorization_level' => $data['memorization_level'],
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            // 3. Handle Documents
            if (isset($data['documents']) && is_array($data['documents'])) {
                foreach ($data['documents'] as $doc) {
                    if (isset($doc['file']) && $doc['file'] instanceof UploadedFile) {
                        $filePath = $doc['file']->store(
                            'public/documents/teachers/'.$applicant->id,
                            'public'
                        );

                        Document::create([
                            'user_id' => $user->id,
                            'applicant_id' => $applicant->id,
                            'name' => $doc['name'] ?? null,
                            'certificate_type' => $doc['certificate_type'] ?? null,
                            'certificate_type_other' => $doc['certificate_type_other'] ?? null,
                            'riwayah' => $doc['riwayah'] ?? null,
                            'issuing_place' => $doc['issuing_place'] ?? null,
                            'issuing_date' => $doc['issuing_date'] ?? null,
                            'file_path' => $filePath,
                        ]);
                    }
                }
            }

            return $applicant;
        });
    }

    public function createStudentApplication(array $data)
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'avatar' => $data['avatar'] ?? null,
                'phone' => $data['phone'] ?? null,
                'phone_zone' => $data['phone_zone'] ?? null,
                'whatsapp' => $data['whatsapp'] ?? null,
                'whatsapp_zone' => $data['whatsapp_zone'] ?? null,
                'gender' => $data['gender'] ?? null,
                'birth_date' => $data['birth_date'] ?? null,
                'country' => $data['country'] ?? null,
                'city' => $data['city'] ?? null,
                'residence' => $data['residence'] ?? null,
            ]);

            $applicant = Applicant::create([
                'user_id' => $user->id,
                'school_id' => $data['school_id'] ?? null,
                'application_type' => 'student',
                'status' => 'pending',
                'bio' => $data['bio'],
                'qualifications' => $data['qualifications'],
                'memorization_level' => $data['memorization_level'] ?? 0,
                'submitted_at' => now(),
            ]);

            return $applicant;
        });
    }
}
