<?php

namespace App\Repositories;

use App\Models\StudentApplicant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Placeholder for StudentApplicant model if it does not exist
if (! class_exists('App\\Models\\StudentApplicant')) {
    eval('namespace App\\Models; class StudentApplicant extends \\Illuminate\\Database\\Eloquent\\Model {}');
}

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

    public function create($data)
    {
        $userData = $data['user'];
        $userData['password'] = Hash::make($userData['password']);
        $user = User::create($userData);
        $student = $user->student()->create($data);

        return $student->fresh(['user']);
    }

    // Add methods for actions (accept, reject, etc.)
}
