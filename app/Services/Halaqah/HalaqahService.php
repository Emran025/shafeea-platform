<?php

namespace App\Services\Halaqah;

use App\Events\StudentEnrolledInHalaqahEvent;
use App\Models\Halaqah\Halaqah;
use App\Models\Student\Enrollment;
use App\Models\Student\Student;
use App\Models\Subscription\Plan;
use App\Models\Teacher\Teacher;
use Exception;
use Illuminate\Support\Facades\DB;

class HalaqahService
{
    public function createHalaqah(array $data)
    {
        return DB::transaction(function () use ($data) {
            $teacherUserId = $data['teacher_id'] ?? null;
            unset($data['teacher_id']);

            $halaqah = Halaqah::create($data);

            if ($teacherUserId) {
                $teacher = Teacher::findByIdentifierOrFail($teacherUserId);
                $halaqah->teachers()->attach($teacher->id, [
                    'assigned_at' => now(),
                    'is_current' => true,
                    'note' => 'تم الإسناد عند إنشاء الحلقة ',
                ]);
            }

            return $halaqah;
        });
    }

    public function updateHalaqah(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $halaqah = Halaqah::findOrFail($id);

            if (isset($data['teacher_id'])) {
                $this->assignTeacher($id, $data['teacher_id']);
                unset($data['teacher_id']);
            }

            $halaqah->update($data);

            return $halaqah->fresh(['currentTeacher.user', 'school']);
        });
    }

    public function assignTeacher(int $id, $teacherUserId)
    {
        return DB::transaction(function () use ($id, $teacherUserId) {
            $halaqah = Halaqah::findOrFail($id);
            $teacher = Teacher::findByIdentifierOrFail($teacherUserId);

            $halaqah->teachers()->updateExistingPivot(null, ['is_current' => false]);
            $halaqah->teachers()->detach($teacher->id);
            $halaqah->teachers()->attach($teacher->id, [
                'assigned_at' => now(),
                'is_current' => true,
                'note' => 'تم الإسناد يدوياً',
            ]);

            return $halaqah;
        });
    }

    public function assignStudents(int $id, array $studentUserIds)
    {
        $newStudentIds = [];

        $halaqah = DB::transaction(function () use ($id, $studentUserIds, &$newStudentIds) {
            $halaqah = Halaqah::lockForUpdate()->findOrFail($id);
            $studentIds = Student::whereIn('user_id', $studentUserIds)
                ->orWhereIn('username', $studentUserIds)
                ->pluck('id')
                ->all();

            $existingStudentIds = Enrollment::where('halaqah_id', $id)
                ->whereIn('student_id', $studentIds)
                ->pluck('student_id')
                ->all();

            $newStudentIds = array_diff($studentIds, $existingStudentIds);

            if (empty($newStudentIds)) {
                return $halaqah;
            }

            if (($halaqah->sum_of_students + count($newStudentIds)) > $halaqah->max_students) {
                throw new Exception("Assigning these students exceeds the halaqah's maximum capacity of {$halaqah->max_students}.");
            }

            $defaultPlanId = 1;
            if (! Plan::where('id', $defaultPlanId)->exists()) {
                throw new Exception('Default plan with ID 1 does not exist.');
            }

            $enrollments = [];
            foreach ($newStudentIds as $studentId) {
                $enrollments[] = [
                    'student_id' => $studentId,
                    'halaqah_id' => $id,
                    'enrolled_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            Enrollment::insert($enrollments);

            $newEnrollmentIds = Enrollment::where('halaqah_id', $id)
                ->whereIn('student_id', $newStudentIds)
                ->pluck('id');

            $pivotData = [];
            foreach ($newEnrollmentIds as $enrollmentId) {
                $pivotData[] = [
                    'enrollment_id' => $enrollmentId,
                    'plan_id' => $defaultPlanId,
                    'is_current' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            DB::table('enrollment_plan')->insert($pivotData);
            $halaqah->increment('sum_of_students', count($newStudentIds));

            return $halaqah;
        });

        // Dispatch one enrollment notification per newly enrolled student (post-commit)
        if (! empty($newStudentIds)) {
            $newEnrollments = Enrollment::where('halaqah_id', $id)
                ->whereIn('student_id', array_values($newStudentIds))
                ->get();

            foreach ($newEnrollments as $enrollment) {
                StudentEnrolledInHalaqahEvent::dispatch($enrollment);
            }
        }

        return $halaqah;
    }
}
