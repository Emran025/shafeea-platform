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
        if (isset($data['experience_years'])) {
            $teacher->experience_years = $data['experience_years'];
        }
        $teacher->save();
        if (isset($data['user']) && $teacher->user) {
            $teacher->user->update($data['user']);
        }

        return $teacher->fresh(['user', 'halaqahs']);
    }

    public function assignHalaqas($teacherId, $halaqaIds)
    {
        try {
            $teacher = Teacher::findOrFail($teacherId);
            if (empty($halaqaIds)) {
                return true;
            }
            // Assign teacher_id to each halaqah
            \App\Models\Halaqah::whereIn('id', $halaqaIds)->update(['teacher_id' => $teacherId]);

            return true;
        } catch (\Throwable $e) {
            Log::error($e);
            throw $e;
        }
    }

    public function create($data)
    {
        $userData = $data['user'];
        $userData['password'] = Hash::make($userData['password']);
        $user = User::create($userData);
        $teacher = $user->teacher()->create($data);

        return $teacher->fresh(['user', 'halaqahs']);
    }

    // Add methods for assign, actions, etc. as needed
}
