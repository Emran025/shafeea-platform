<?php

namespace App\Repositories;

use App\Models\Student;
use Illuminate\Pagination\LengthAwarePaginator;
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
        // Update related user fields if present in $data
        $map = [
            'name' => 'name',
            'avatar' => 'avatar',
            'gender' => 'gender',
            'birthDate' => 'birth_date',
            'email' => 'email',
            'phoneZone' => 'phone_zone',
            'phone' => 'phone',
            'whatsappZone' => 'whatsapp_zone',
            'whatsappPhone' => 'whatsapp',
            'country' => 'country',
            'residence' => 'residence',
            'city' => 'city',
        ];

        $userData = [];
        foreach ($map as $input => $column) {
            if (isset($data[$input])) {
                $userData[$column] = $data[$input];
            }
        }
        if (!empty($userData) && $student->user) {
            $student->user->update($userData);
        }
        return $student->fresh(['user', 'enrollments.halaqah']);
    }
    public function sync($updatedSince, $limit, $page): LengthAwarePaginator
    {
        return Student::with([
            'user',
            'enrollments' => function ($query) {
                $query->latest('enrolled_at')->limit(1);
            },
            'enrollments.plan.frequencyType',
            'enrollments.plan.reviewUnit',
            'enrollments.plan.memorizationUnit',
            'enrollments.plan.sardUnit',
            'enrollments.halaqah',
        ])
            ->where(function ($query) use ($updatedSince) {
                $query->where('updated_at', '>=', $updatedSince)
                    ->orWhere('created_at', '>=', $updatedSince);
            })
            ->paginate($limit, ['*'], 'page', $page);
    }
    // Add methods for follow-up, assign, actions, etc. as needed
}
