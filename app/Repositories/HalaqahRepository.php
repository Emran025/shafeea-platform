<?php

namespace App\Repositories;

use App\Models\Halaqah;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class HalaqahRepository
{
    /**
     * Get all halaqahs with filtering and pagination.
     *
     * @param array $filters
     * @param bool $pagination
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
            $query->where('name', 'like', '%' . $filters['name'] . '%');
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
     * @param int $id
     * @return Halaqah
     */
    public function find($id)
    {
        // Eager load relationships for the single item view
        return Halaqah::with(['teacher.user', 'school', 'students.user'])->findOrFail($id);
    }

    /**
     * Create a new halaqah.
     *
     * @param array $data
     * @return Halaqah
     */
    public function create(array $data)
    {
        return Halaqah::create($data);
    }

    /**
     * Update an existing halaqah.
     *
     * @param int $id
     * @param array $data
     * @return Halaqah
     */
    public function update($id, array $data)
    {
        $halaqah = $this->find($id);
        $halaqah->update($data);
        return $halaqah->fresh(['teacher.user', 'school']); // Reload relations
    }

    /**
     * Assign a teacher to a halaqah.
     *
     * @param int $id
     * @param int $teacherId
     * @return Halaqah
     */
    public function assignTeacher($id, $teacherId)
    {
        $halaqah = $this->find($id);
        $halaqah->teacher_id = $teacherId;
        $halaqah->save();
        return $halaqah;
    }

    /**
     * Assign a list of students to a halaqah.
     *
     * @param int $id
     * @param array $studentIds
     * @return Halaqah
     * @throws Exception
     */
    public function assignStudents($id, array $studentIds)
    {
        return DB::transaction(function () use ($id, $studentIds) {
            $halaqah = Halaqah::lockForUpdate()->findOrFail($id);

            // Filter out students who are already enrolled to prevent duplicates
            $existingStudentIds = Enrollment::where('halaqah_id', $id)
                                             ->whereIn('student_id', $studentIds)
                                             ->pluck('student_id')
                                             ->all();

            $newStudentIds = array_diff($studentIds, $existingStudentIds);
            
            if (empty($newStudentIds)) {
                // No new students to add
                return $halaqah;
            }

            if (($halaqah->sum_of_students + count($newStudentIds)) > $halaqah->max_students) {
                throw new Exception("Assigning these students exceeds the halaqah's maximum capacity of {$halaqah->max_students}.");
            }

            $enrollments = [];
            foreach ($newStudentIds as $studentId) {
                $enrollments[] = [
                    'student_id' => $studentId,
                    'halaqah_id' => $id,
                    'enrolled_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }

            Enrollment::insert($enrollments);

            // Update the student count on the halaqah
            $halaqah->increment('sum_of_students', count($enrollments));

            return $halaqah;
        });
    }

    /**
     * Get the enrollment history of students for a halaqah.
     *
     * @param int $id
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getStudentHistory($id, array $filters)
    {
        $this->find($id); // Ensures halaqah exists, or throws 404

        $limit = $filters['limit'] ?? 10;

        // NOTE: This assumes a nullable `left_at` column exists on your `enrollments` table.
        return Enrollment::where('halaqah_id', $id)
            ->with('student.user') // Eager load student and their user data
            ->orderBy($filters['sortBy'] ?? 'enrolled_at', $filters['sortOrder'] ?? 'desc')
            ->paginate($limit);
    }

    /**
     * Get students who have completed the Quran (Khatm) in a halaqah.
     *
     * @param int $id
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getKhatmStudents($id, array $filters)
    {
        $halaqah = $this->find($id);
        $limit = $filters['limit'] ?? 10;

        // ASSUMPTION: A student has completed if their `status` on the `students` table is 'completed'.
        return $halaqah->students()
            ->where('students.memorization_level','=', 30)
            ->with('user')
            ->paginate($limit);
    }

    /**
     * Get the history of teachers for a halaqah.
     *
     * @param int $id
     * @param array $filters
     * @return \Illuminate\Support\Collection
     */
    public function getTeacherHistory($id, array $filters)
    {
        // IMPORTANT: The current database schema only stores the *current* teacher.
        // A full history requires a separate log table (e.g., `halaqah_teacher_logs`)
        // with `halaqah_id`, `teacher_id`, `assigned_at`, `unassigned_at`.
        // For now, this method will only return the current teacher.

        $halaqah = Halaqah::with('teacher.user')->findOrFail($id);

        if ($halaqah->teacher) {
            return collect([$halaqah->teacher]); // Return as a collection to mimic a list
        }

        return collect([]); // Return an empty collection if no teacher is assigned
    }

    public function getUpdatedSince($updatedSince, $limit = 100, $page = 1)
    {
        return Halaqah::with('students') // eager load to avoid resource error
            ->when($updatedSince, function ($query) use ($updatedSince) {
                $query->where('updated_at', '>=', $updatedSince);
            })
            ->paginate($limit, ['*'], 'page', $page);
    }
}