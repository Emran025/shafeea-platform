<?php

namespace App\Repositories;

use App\Models\Student;

class StudentRepository
{
    public function all($filters = [], $pagination = true)
    {
        $query = Student::with(['user', 'enrollments.halaqah']);
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
        return Student::with(['user', 'enrollments.halaqah'])->findOrFail($id);
    }

    public function update($id, $data)
    {
        $student = Student::findOrFail($id);
        // Map camelCase to snake_case
        if (isset($data['memorizationLevel'])) {
            $data['memorization_level'] = $data['memorizationLevel'];
            unset($data['memorizationLevel']);
        }
        if (isset($data['qualification'])) {
            $student->qualification = $data['qualification'];
        }
        if (isset($data['memorization_level'])) {
            $student->memorization_level = $data['memorization_level'];
        }
        // Always set status if provided, else keep current
        if (isset($data['status'])) {
            $student->status = $data['status'];
        }
        $student->save();
        if (isset($data['user'])) {
            $student->user->update($data['user']);
        }
        return $student->fresh(['user', 'enrollments.halaqah']);
    }

    // Add methods for follow-up, assign, actions, etc. as needed
}








