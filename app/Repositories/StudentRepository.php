<?php

namespace App\Repositories;

use App\Models\Student\Enrollment;
use App\Models\Halaqah\Halaqah;
use App\Models\Tracking\Tracking;
use App\Models\Student\Student;
use App\Models\Student\StudentReport;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use App\Models\Subscription\Plan;
use App\Models\Tracking\TrackingDetail;

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
        $student = Student::findByIdentifier($userId);
        if (!$student) {
            throw (new ModelNotFoundException)->setModel(Student::class);
        }
        return $student->load([
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

    public function delete($userId): ?bool
    {
        $student = Student::findByIdentifierOrFail($userId);

        return $student->delete();
    }

    public function getReports($userId)
    {
        $student = Student::findByIdentifierOrFail($userId);
        return StudentReport::where('student_id', $student->id)->get();
    }

    public function getHalaqahs($userId)
    {
        return Student::findByIdentifierOrFail($userId)->enrollments()->with('halaqah')->get()->pluck('halaqah');
    }

    public function isInHalaqah($userId, int $halaqahId): bool
    {
        $student = Student::findByIdentifierOrFail($userId);
        return Enrollment::where('student_id', $student->id)
            ->where('halaqah_id', $halaqahId)
            ->exists();
    }

    public function getProgress($userId): array
    {
        $student = Student::findByIdentifierOrFail($userId);
        $reports = StudentReport::where('student_id', $student->id)->orderBy('report_date', 'desc')->get();

        return [
            'total_reports' => $reports->count(),
            'last_report' => $reports->first() ?? null,
        ];
    }

    public function getPlans($userId)
    {
        $student = Student::findByIdentifierOrFail($userId);
        return Enrollment::where('student_id', $student->id)
            ->with('plans')
            ->get()
            ->pluck('plans')
            ->flatten();
    }

    public function getActivePlan($userId)
    {
        $student = Student::findByIdentifierOrFail($userId);
        $enrollment = Enrollment::where('student_id', $student->id)
            ->orderByDesc('enrolled_at')
            ->with('currentPlan')
            ->first();

        return $enrollment && $enrollment->currentPlan->isNotEmpty() ? $enrollment->currentPlan->first() : null;
    }

    public function getEnrollment($userId, int $halaqahId): Enrollment
    {
        $student = Student::findByIdentifierOrFail($userId);
        return Enrollment::firstOrCreate([
            'student_id' => $student->id,
            'halaqah_id' => $halaqahId,
        ]);
    }

    public function getTrackingsForStudent($userId)
    {
        $student = Student::findByIdentifierOrFail($userId);
        $enrollmentIds = Enrollment::where('student_id', $student->id)->pluck('id');

        return Tracking::whereIn('enrollment_id', $enrollmentIds)->with(['details'])->get();
    }

    public function getTrackingDetails(int $trackingId)
    {
        return TrackingDetail::where('tracking_id', $trackingId)->get();
    }

    public function deletePlan(int $planId): ?bool
    {
        $plan = Plan::findOrFail($planId);

        return $plan->delete();
    }

    public function deleteTracking(int $trackingId): ?bool
    {
        $tracking = Tracking::findOrFail($trackingId);

        return $tracking->delete();
    }

    public function deleteTrackingDetail(int $trackingDetailId): ?bool
    {
        $detail = TrackingDetail::findOrFail($trackingDetailId);

        return $detail->delete();
    }
}
