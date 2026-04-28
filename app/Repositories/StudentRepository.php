<?php

namespace App\Repositories;

use App\Models\Enrollment;
use App\Models\Halaqah;
use App\Models\Student;
use App\Models\StudentReport;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use App\Models\Tracking;
use App\Models\Plan;
use App\Models\TrackingDetail;

class StudentRepository
{
    /**
     * --------------------------------------------------------------------------
     * PURE DATA ACCESS METHODS
     * --------------------------------------------------------------------------
     */

    public function all($filters = [], $pagination = true)
    {
        $query = Student::with([
            'user',
            'enrollments' => function ($query) {
                $query->latest('enrolled_at');
            },
            'enrollments.currentPlan.frequencyType',
            'enrollments.currentPlan.reviewUnit',
            'enrollments.currentPlan.memorizationUnit',
            'enrollments.currentPlan.sardUnit',
            'enrollments.halaqah',
        ]);

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

    public function find($userId)
    {
        return Student::with([
            'user',
            'enrollments' => function ($query) {
                $query->latest('enrolled_at');
            },
            'enrollments.currentPlan.frequencyType',
            'enrollments.currentPlan.reviewUnit',
            'enrollments.currentPlan.memorizationUnit',
            'enrollments.currentPlan.sardUnit',
            'enrollments.halaqah',
        ])
        ->where('user_id', $userId)
        ->firstOrFail();
    }

    public function sync($updatedSince, $limit, $page): LengthAwarePaginator
    {
        $query = Student::with([
            'user',
            'enrollments' => function ($query) {
                $query->latest('enrolled_at');
            },
            'enrollments.currentPlan.frequencyType',
            'enrollments.currentPlan.reviewUnit',
            'enrollments.currentPlan.memorizationUnit',
            'enrollments.currentPlan.sardUnit',
            'enrollments.halaqah',
        ]);

        if ($updatedSince && $updatedSince != '0') {
            if (is_numeric($updatedSince)) {
                $updatedSince = \Illuminate\Support\Carbon::createFromTimestampMs($updatedSince);
            }
            $query->where(function ($query) use ($updatedSince) {
                $query->where('updated_at', '>=', $updatedSince)
                    ->orWhere('created_at', '>=', $updatedSince);
            });
        }

        return $query->paginate($limit, ['*'], 'page', $page);
    }

    public function delete(int $userId): ?bool
    {
        $student = Student::where('user_id', $userId)->firstOrFail();

        return $student->delete();
    }

    public function getReports(int $userId)
    {
        $student = Student::where('user_id', $userId)->firstOrFail();
        return StudentReport::where('student_id', $student->id)->get();
    }

    public function getHalaqahs(int $userId)
    {
        return Student::where('user_id', $userId)->firstOrFail()->enrollments()->with('halaqah')->get()->pluck('halaqah');
    }

    public function isInHalaqah(int $userId, int $halaqahId): bool
    {
        $student = Student::where('user_id', $userId)->firstOrFail();
        return Enrollment::where('student_id', $student->id)
            ->where('halaqah_id', $halaqahId)
            ->exists();
    }

    public function getProgress(int $userId): array
    {
        $student = Student::where('user_id', $userId)->firstOrFail();
        $reports = StudentReport::where('student_id', $student->id)->orderBy('report_date', 'desc')->get();

        return [
            'total_reports' => $reports->count(),
            'last_report' => $reports->first() ?? null,
        ];
    }

    public function getPlans(int $userId)
    {
        $student = Student::where('user_id', $userId)->firstOrFail();
        return Enrollment::where('student_id', $student->id)
            ->with('plans')
            ->get()
            ->pluck('plans')
            ->flatten();
    }

    public function getActivePlan(int $userId)
    {
        $student = Student::where('user_id', $userId)->firstOrFail();
        $enrollment = Enrollment::where('student_id', $student->id)
            ->orderByDesc('enrolled_at')
            ->with('currentPlan')
            ->first();

        return $enrollment && $enrollment->currentPlan->isNotEmpty() ? $enrollment->currentPlan->first() : null;
    }

    public function getEnrollment(int $userId, int $halaqahId): Enrollment
    {
        $student = Student::where('user_id', $userId)->firstOrFail();
        return Enrollment::firstOrCreate([
            'student_id' => $student->id,
            'halaqah_id' => $halaqahId,
        ]);
    }

    public function getTrackingsForStudent(int $userId)
    {
        $student = Student::where('user_id', $userId)->firstOrFail();
        $enrollmentIds = Enrollment::where('student_id', $student->id)->pluck('id');

        return \App\Models\Tracking::whereIn('enrollment_id', $enrollmentIds)->with(['details'])->get();
    }

    public function getTrackingDetails(int $trackingId)
    {
        return \App\Models\TrackingDetail::where('tracking_id', $trackingId)->get();
    }

    public function deletePlan(int $planId): ?bool
    {
        $plan = \App\Models\Plan::findOrFail($planId);

        return $plan->delete();
    }

    public function deleteTracking(int $trackingId): ?bool
    {
        $tracking = \App\Models\Tracking::findOrFail($trackingId);

        return $tracking->delete();
    }

    public function deleteTrackingDetail(int $trackingDetailId): ?bool
    {
        $detail = \App\Models\TrackingDetail::findOrFail($trackingDetailId);

        return $detail->delete();
    }
}
