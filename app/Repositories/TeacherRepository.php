<?php

namespace App\Repositories;

use App\Models\Teacher;

class TeacherRepository
{
    /**
     * --------------------------------------------------------------------------
     * PURE DATA ACCESS METHODS
     * --------------------------------------------------------------------------
     */

    public function all($filters = [], $pagination = true)
    {
        $query = Teacher::with(['user', 'halaqahs']);
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
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
        $teacher = Teacher::findByIdentifier($userId);
        if (!$teacher) {
            throw (new \Illuminate\Database\Eloquent\ModelNotFoundException)->setModel(Teacher::class);
        }
        return $teacher->load(['user', 'halaqahs']);
    }
}
