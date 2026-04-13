<?php

namespace App\Repositories;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class TeacherRepository
{
    public function all($filters = [], $pagination = true)
    {
        $query = Teacher::with(['user', 'halaqahs']);
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        $sortBy = $filters['sortBy'] ?? 'created_at';
        $sortOrder = $filters['sortOrder'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);
        if ($pagination) {
            $limit = $filters['limit'] ?? 10;

            return $query->paginate($limit);
        }

        return $query->get();
    }
    public function find($userId)
    {
        return Teacher::with(['user', 'halaqahs'])
            ->where('user_id', $userId)
            ->firstOrFail();
    }

    public function update($userId, $data)
    {
        $teacher = Teacher::where('user_id', $userId)->firstOrFail();
        
        if (isset($data['bio'])) {
            $teacher->bio = $data['bio'];
        }
        if (isset($data['experienceYears'])) {
            $teacher->experience_years = $data['experienceYears'];
        }
        $teacher->save();

        if ($teacher->user) {
            $userFields = [
                'name', 'email', 'avatar', 'gender', 'country', 'residence', 'city', 'phone', 'phone_zone', 'whatsapp', 'whatsapp_zone'
            ];
            $userUpdate = [];
            foreach ($userFields as $field) {
                $camelField = \Illuminate\Support\Str::camel($field);
                if (isset($data[$camelField])) {
                    $userUpdate[$field] = $data[$camelField];
                }
            }
            if (isset($data['birthDate'])) {
                $userUpdate['birth_date'] = $data['birthDate'];
            }
            if (isset($data['phoneZone'])) {
                $userUpdate['phone_zone'] = $data['phoneZone'];
            }
            if (isset($data['whatsappPhone'])) {
                $userUpdate['whatsapp'] = $data['whatsappPhone'];
            }
            if (!empty($userUpdate)) {
                $teacher->user->update($userUpdate);
            }
        }

        return $teacher->fresh(['user', 'halaqahs']);
    }

    public function assignHalaqas($userId, $halaqaIds)
    {
        try {
            $teacher = Teacher::where('user_id', $userId)->firstOrFail();
            if (empty($halaqaIds)) {
                return true;
            }
            // Assign teacher_id to each halaqah
            \App\Models\Halaqah::whereIn('id', $halaqaIds)->update(['teacher_id' => $teacher->id]);

            return true;
        } catch (\Throwable $e) {
            Log::error($e);
            throw $e;
        }
    }

    public function create($data)
    {
        $userData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'avatar' => $data['avatar'] ?? null,
            'gender' => $data['gender'],
            'birth_date' => $data['birthDate'],
            'phone_zone' => $data['phoneZone'],
            'phone' => $data['phone'],
            'whatsapp_zone' => $data['whatsappZone'] ?? null,
            'whatsapp' => $data['whatsappPhone'] ?? null,
            'country' => $data['country'],
            'residence' => $data['residence'],
            'city' => $data['city'],
        ];

        $user = User::create($userData);
        
        $teacherData = [
            'bio' => $data['bio'] ?? null,
            'experience_years' => $data['experienceYears'] ?? 0,
            'status' => 'active',
        ];

        $teacher = $user->teacher()->create($teacherData);

        return $teacher->fresh(['user', 'halaqahs']);
    }

    // Add methods for assign, actions, etc. as needed
}
