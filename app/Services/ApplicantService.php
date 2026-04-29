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
    /**
     * Create a teacher application.
     * 
     * @param array $data         Validated text data from $request->validated()
     * @param array $documentFiles Files from $request->file('documents', [])
     *                            Structure: [0 => ['file' => UploadedFile], ...]
     *                            IMPORTANT: $request->validated() never returns nested UploadedFile objects.
     */
    public function createTeacherApplication(array $data, array $documentFiles = [])
    {
        return DB::transaction(function () use ($data, $documentFiles) {
            // 1. Create User
            $user = User::create([
                'name'     => $data['user_name'] ?? $data['name'],
                'email'    => $data['user_email'] ?? $data['email'],
                'phone'    => $data['user_phone'] ?? $data['phone'] ?? null,
                'country'  => $data['user_country'] ?? $data['country'] ?? null,
                'city'     => $data['user_city'] ?? $data['city'] ?? null,
                'password' => Hash::make($data['user_password'] ?? $data['password']),
            ]);

            // 2. Create Applicant
            $applicant = Applicant::create([
                'user_id'           => $user->id,
                'school_id'         => $data['school_id'] ?? null,
                'application_type'  => 'teacher',
                'bio'               => $data['bio'],
                'qualifications'    => $data['qualifications'],
                'memorization_level'=> $data['memorization_level'],
                'status'            => 'pending',
                'submitted_at'      => now(),
            ]);

            // 3. Handle Documents
            // Files are stored directly to their permanent location — no temp/session involved.
            // The permanent path is: documents/teachers/{applicant_id}/{filename}
            if (isset($data['documents']) && is_array($data['documents'])) {
                foreach ($data['documents'] as $key => $doc) {
                    // Skip completely empty document entries
                    if (empty($doc['name']) && empty($doc['certificate_type'])) {
                        continue;
                    }

                    $filePath = null;

                    // Files MUST come from $documentFiles — they are NEVER in $data for nested arrays
                    $uploadedFile = $documentFiles[$key]['file'] ?? null;

                    if ($uploadedFile instanceof UploadedFile && $uploadedFile->isValid()) {
                        $filePath = $uploadedFile->store(
                            'documents/teachers/' . $applicant->id,
                            'public'
                        );
                    }

                    // Always create the Document record — metadata must survive even if file fails
                    Document::create([
                        'user_id'                => $user->id,
                        'name'                   => $doc['name'] ?? '',
                        'certificate_type'       => $doc['certificate_type'] ?? '',
                        'certificate_type_other' => $doc['certificate_type_other'] ?? null,
                        'riwayah'                => $doc['riwayah'] ?? null,
                        'issuing_place'          => $doc['issuing_place'] ?? null,
                        'issuing_date'           => $doc['issuing_date'] ?? null,
                        'file_path'              => $filePath,
                    ]);
                }
            }

            return $applicant;
        });
    }

    /**
     * Create a student application.
     * Supports both direct keys (API) and prefixed keys (Unified Web Contract).
     */
    public function createStudentApplication(array $data)
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['user_name'] ?? $data['name'],
                'email' => $data['user_email'] ?? $data['email'],
                'password' => Hash::make($data['user_password'] ?? $data['password']),
                'avatar' => $data['avatar'] ?? null,
                'phone' => $data['user_phone'] ?? $data['phone'] ?? null,
                'phone_zone' => $data['phone_zone'] ?? null,
                'whatsapp' => $data['whatsapp'] ?? null,
                'whatsapp_zone' => $data['whatsapp_zone'] ?? null,
                'gender' => $data['gender'] ?? null,
                'birth_date' => $data['birth_date'] ?? null,
                'country' => $data['user_country'] ?? $data['country'] ?? null,
                'city' => $data['user_city'] ?? $data['city'] ?? null,
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
