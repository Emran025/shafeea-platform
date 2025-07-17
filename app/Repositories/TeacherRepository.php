<?php

namespace App\Repositories;

use App\Models\Teacher;

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

    public function find($id)
    {
        return Teacher::with(['user', 'halaqahs'])->findOrFail($id);
    }

    public function update($id, $data)
    {
        $teacher = Teacher::findOrFail($id);
        // Map camelCase to snake_case if needed
        if (isset($data['bio'])) {
            $teacher->bio = $data['bio'];
        }
        if (isset($data['experience_years'])) {
            $teacher->experience_years = $data['experience_years'];
        }
        $teacher->save();
        if (isset($data['user'])) {
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
            \Log::error($e);
            throw $e;
        }
    }

    // Add methods for assign, actions, etc. as needed
} 