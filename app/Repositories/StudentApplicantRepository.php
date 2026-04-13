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

        $studentData = [
            'qualification' => $data['qualification'],
            'memorization_level' => $data['memorizationLevel'],
            'status' => $data['status'] ?? 'active',
        ];

        $student = $user->student()->create($studentData);

        return $student->fresh(['user']);
    }

    // Add methods for actions (accept, reject, etc.)
}
