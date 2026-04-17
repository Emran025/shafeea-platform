<?php

namespace App\Services;

use App\Models\Teacher;
use App\Models\User;
use App\Models\Halaqah;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TeacherService
{
    public function createTeacher(array $data)
    {
        return DB::transaction(function () use ($data) {
            $userData = [
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => isset($data['password']) ? Hash::make($data['password']) : Hash::make(Str::random(12)),
                'avatar' => $data['avatar'] ?? null,
                'gender' => $data['gender'],
                'birth_date' => $data['birth_date'] ?? null,
                'phone_zone' => $data['phone_zone'] ?? null,
                'phone' => $data['phone'] ?? null,
                'whatsapp_zone' => $data['whatsapp_zone'] ?? null,
                'whatsapp' => $data['whatsapp'] ?? null,
                'country' => $data['country'] ?? null,
                'residence' => $data['residence'] ?? null,
                'city' => $data['city'] ?? null,
            ];

            $user = User::create($userData);
            
            $teacherData = [
                'bio' => $data['bio'] ?? null,
                'experience_years' => $data['experience_years'] ?? 0,
                'status' => 'active',
            ];

            $teacher = $user->teacher()->create($teacherData);

            return $teacher->fresh(['user', 'halaqahs']);
        });
    }

    public function updateTeacher(int $userId, array $data)
    {
        return DB::transaction(function () use ($userId, $data) {
            $teacher = Teacher::where('user_id', $userId)->firstOrFail();
            
            if (isset($data['bio'])) {
                $teacher->bio = $data['bio'];
            }
            if (isset($data['experience_years'])) {
                $teacher->experience_years = $data['experience_years'];
            }
            $teacher->save();

            if ($teacher->user) {
                $userFields = [
                    'name', 'email', 'avatar', 'gender', 'country', 'residence', 'city', 'phone', 'phone_zone', 'whatsapp', 'whatsapp_zone', 'birth_date'
                ];
                
                $userData = array_intersect_key($data, array_flip($userFields));
                
                if (!empty($userData)) {
                    $teacher->user->update($userData);
                }
            }

            return $teacher->fresh(['user', 'halaqahs']);
        });
    }

    public function assignHalaqas(int $userId, array $halaqaIds)
    {
        return DB::transaction(function () use ($userId, $halaqaIds) {
            $teacher = Teacher::where('user_id', $userId)->firstOrFail();
            if (empty($halaqaIds)) {
                return true;
            }
            // Reset existing assignments if needed? 
            // The original logic just updated teacher_id for the given halaqahs
            Halaqah::whereIn('id', $halaqaIds)->update(['teacher_id' => $teacher->id]);

            return true;
        });
    }
}
