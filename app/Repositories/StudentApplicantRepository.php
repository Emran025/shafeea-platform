<?php

namespace App\Repositories;

// Placeholder for StudentApplicant model if it does not exist
if (!class_exists('App\\Models\\StudentApplicant')) {
    eval('namespace App\\Models; class StudentApplicant extends \\Illuminate\\Database\\Eloquent\\Model {}');
}

use App\Models\StudentApplicant;

class StudentApplicantRepository
{
    public function all($filters = [], $pagination = true)
    {
        $query = StudentApplicant::query();
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
        return StudentApplicant::findOrFail($id);
    }

    // Add methods for actions (accept, reject, etc.)
}
