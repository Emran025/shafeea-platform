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
        return Halaqah::with(['currentTeacher.user', 'school', 'students.user'])->findOrFail($id);
    }

    /**
     * Create a new halaqah.
     *
     * @param array $data
     * @return Halaqah
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $teacherId = $data['teacher_id'] ?? null;
            unset($data['teacher_id']);

            $halaqah = Halaqah::create($data);

            if ($teacherId) {
                $halaqah->teachers()->attach($teacherId, [
                    'assigned_at' => now(),
                    'is_current' => true,
                    'note' => 'تم الإسناد عند إنشاء الحلقة',
                ]);
            }

            return $halaqah;
        });
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
        return DB::transaction(function () use ($id, $data) {
            $halaqah = $this->find($id);

            if (isset($data['teacher_id'])) {
                $this->assignTeacher($id, $data['teacher_id']);
                unset($data['teacher_id']);
            }

            $halaqah->update($data);

            return $halaqah->fresh(['currentTeacher.user', 'school']); // Reload relations
        });
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
        return DB::transaction(function () use ($id, $teacherId) {
            $halaqah = $this->find($id);

            // Set all other teachers for this halaqah to not be current
            $halaqah->teachers()->updateExistingPivot(null, ['is_current' => false]);

            // Detach the teacher if they are already attached to prevent duplicates
            $halaqah->teachers()->detach($teacherId);

            // Attach the new teacher as the current one
            $halaqah->teachers()->attach($teacherId, [
                'assigned_at' => now(),
                'is_current' => true,
                'note' => 'تم الإسناد يدوياً',
            ]);

            return $halaqah;
        });
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

            // Check for the existence of the default plan
            $defaultPlanId = 1;
            if (!\App\Models\Plan::where('id', $defaultPlanId)->exists()) {
                throw new Exception("Default plan with ID 1 does not exist.");
            }

            // Get the most recent plan for each of the new students
            $studentPlans = Enrollment::whereIn('student_id', $newStudentIds)
                                      ->orderBy('created_at', 'desc')
                                      ->get()
                                      ->groupBy('student_id')
                                      ->map(function ($enrollments) {
                                          return $enrollments->first()->plan_id;
                                      });

            $enrollments = [];
            foreach ($newStudentIds as $studentId) {
                $planId = $studentPlans->get($studentId, $defaultPlanId); // Use student's plan, or default
                $enrollments[] = [
                    'student_id' => $studentId,
                    'halaqah_id' => $id,
                    'plan_id' => $planId,
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
        $halaqah = $this->find($id);

        return $halaqah->teachers()
            ->with('user')
            ->orderBy('pivot_assigned_at', 'desc')
            ->get();
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
