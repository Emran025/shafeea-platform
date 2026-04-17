<?php

namespace App\Repositories;

use App\Models\Enrollment;
use App\Models\Halaqah;

class HalaqahRepository
{
    /**
     * --------------------------------------------------------------------------
     * PURE DATA ACCESS METHODS
     * --------------------------------------------------------------------------
     */

    /**
     * Get all halaqahs with filtering and pagination.
     *
     * @param  array  $filters
     * @param  bool  $pagination
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Database\Eloquent\Collection
     */
    public function all($filters = [], $pagination = true)
    {
        // Eager load relationships to prevent N+1 queries
        $query = Halaqah::with(['teacher.user', 'school']);

        if (isset($filters['status'])) {
            $query->where('is_active', $filters['status']);
        }

        if (isset($filters['name'])) {
            $query->where('name', 'like', '%'.$filters['name'].'%');
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

    /**
     * Find a single halaqah by its ID.
     *
     * @param  int  $id
     * @return Halaqah
     */
    public function find($id)
    {
        // Eager load relationships for the single item view
        return Halaqah::with(['currentTeacher.user', 'school', 'students.user'])->findOrFail($id);
    }

    /**
     * Get the enrollment history of students for a halaqah.
     *
     * @param  int  $id
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getStudentHistory($id, array $filters)
    {
        $this->find($id); // Ensures halaqah exists, or throws 404

        $limit = $filters['limit'] ?? 10;

        return Enrollment::where('halaqah_id', $id)
            ->with('student.user') // Eager load student and their user data
            ->orderBy($filters['sortBy'] ?? 'enrolled_at', $filters['sortOrder'] ?? 'desc')
            ->paginate($limit);
    }

    /**
     * Get students who have completed the Quran (Khatm) in a halaqah.
     *
     * @param  int  $id
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getKhatmStudents($id, array $filters)
    {
        $halaqah = $this->find($id);
        $limit = $filters['limit'] ?? 10;

        return $halaqah->students()
            ->where('students.memorization_level', '=', 30)
            ->with('user')
            ->paginate($limit);
    }

    /**
     * Get the history of teachers for a halaqah.
     *
     * @param  int  $id
     * @return \Illuminate\Support\Collection
     */
    public function getTeacherHistory($id, array $filters)
    {
        $halaqah = $this->find($id);

        return $halaqah->teachers()
            ->with('user')
            ->orderBy('pivot_assigned_at', 'desc')
            ->get();
    }

    /**
     * Get halaqahs updated since a specific time.
     */
    public function getUpdatedSince($updatedSince, $limit = 100, $page = 1)
    {
        return Halaqah::with('students')
            ->when($updatedSince, function ($query) use ($updatedSince) {
                if (is_numeric($updatedSince)) {
                    $updatedSince = \Illuminate\Support\Carbon::createFromTimestampMs($updatedSince);
                }
                $query->where('updated_at', '>=', $updatedSince);
            })
            ->paginate($limit, ['*'], 'page', $page);
    }
}
