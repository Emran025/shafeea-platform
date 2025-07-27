<?php

namespace App\Repositories;

use App\Models\Student;
use App\Models\Enrollment;

use App\Models\Halaqah;

use App\Models\StudentReport;

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
        ])->findOrFail($id);
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
    /**
     * Delete a student by ID.
     *
     * @param int $id
     * @return bool|null
     */
    public function delete(int $id): ?bool
    {
        $student = Student::findOrFail($id);
        return $student->delete();
    }

    /**
     * Register a student to a halaqah.
     *
     * @param int $studentId
     * @param int $halaqahId
     * @return bool
     */
    public function joinHalaqah(int $studentId, int $halaqahId): bool
    {
        $halaqah = Halaqah::findOrFail($halaqahId);
        $halaqah->enrollments()->create([
            'student_id' => $studentId,
            'halaqah_id' => $halaqahId,
            'enrolled_at' => now(),
        ]);
        return true;
    }

    /**
     * Remove a student from a halaqah.
     *
     * @param int $studentId
     * @param int $halaqahId
     * @return bool
     */
    public function leaveHalaqah(int $studentId, int $halaqahId): bool
    {
        Enrollment::where('student_id', $studentId)
            ->where('halaqah_id', $halaqahId)
            ->delete();
        return true;
    }

    /**
     * Get reports of a student.
     *
     * @param int $studentId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getReports(int $studentId)
    {
        return StudentReport::where('student_id', $studentId)->get();
    }
    /**
     * Get all halaqahs student is enrolled in.
     *
     * @param int $studentId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getHalaqahs(int $studentId)
    {
        return Student::findOrFail($studentId)->enrollments()->with('halaqah')->get()->pluck('halaqah');
    }

    /**
     * Check if student is enrolled in a specific halaqah.
     *
     * @param int $studentId
     * @param int $halaqahId
     * @return bool
     */
    public function isInHalaqah(int $studentId, int $halaqahId): bool
    {
        return Enrollment::where('student_id', $studentId)
            ->where('halaqah_id', $halaqahId)
            ->exists();
    }

    /**
     * Get student progress summary from reports.
     *
     * @param int $studentId
     * @return array{total_reports: int, last_report: ?Report}
     */
    public function getProgress(int $studentId): array
    {
        $reports = StudentReport::where('student_id', $studentId)->orderBy('report_date', 'desc')->get();
        return [
            'total_reports' => $reports->count(),
            'last_report' => $reports->first() ?? null,
        ];
    }

    /**
     * Get all plans for a student via enrollments.
     *
     * @param int $studentId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getPlans(int $studentId)
    {
        return Enrollment::where('student_id', $studentId)
            ->with('plan')
            ->get()
            ->pluck('plan')
            ->filter();
    }

    /**
     * Get the active plan for a student (most recent enrollment).
     *
     * @param int $studentId
     * @return Plan|null
     */
    public function getActivePlan(int $studentId)
    {
        $enrollment = Enrollment::where('student_id', $studentId)
            ->orderByDesc('enrolled_at')
            ->with('plan')
            ->first();
        return $enrollment ? $enrollment->plan : null;
    }

    /**
     * Create a new plan and enroll the student in it.
     *
     * @param int $studentId
     * @param array $data
     * @return Plan
     */
    public function createPlan(int $studentId, array $data)
    {
        $plan = \App\Models\Plan::create($data);
        Enrollment::create([
            'student_id' => $studentId,
            'halaqah_id' => $data['halaqah_id'], // halaqah_id must be provided in $data
            'enrolled_at' => $data['enrolled_at'] ?? now(),
            'plan_id' => $plan->id,
        ]);
        return $plan;
    }

    /**
     * Update an existing plan.
     *
     * @param int $planId
     * @param array $data
     * @return Plan
     */
    public function updatePlan(int $planId, array $data)
    {
        $plan = \App\Models\Plan::findOrFail($planId);
        $plan->update($data);
        return $plan;
    }

    /**
     * Create a tracking for a plan.
     *
     * @param int $planId
     * @param array $data
     * @return Tracking
     */
    public function createTracking(int $planId, array $data)
    {
        $data['plan_id'] = $planId;
        return \App\Models\Tracking::create($data);
    }

    /**
     * Update a tracking.
     *
     * @param int $trackingId
     * @param array $data
     * @return Tracking
     */
    public function updateTracking(int $trackingId, array $data)
    {
        $tracking = \App\Models\Tracking::findOrFail($trackingId);
        $tracking->update($data);
        return $tracking;
    }

    /**
     * Add a tracking detail to a tracking.
     *
     * @param int $trackingId
     * @param array $data
     * @return TrackingDetail
     */
    public function addTrackingDetail(int $trackingId, array $data)
    {
        $data['tracking_id'] = $trackingId;
        return \App\Models\TrackingDetail::create($data);
    }

    /**
     * Get all trackings for a student (via all their plans).
     *
     * @param int $studentId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTrackingsForStudent(int $studentId)
    {
        $planIds = $this->getPlans($studentId)->pluck('id');
        return \App\Models\Tracking::whereIn('plan_id', $planIds)->with(['details'])->get();
    }

    /**
     * Get all tracking details for a tracking.
     *
     * @param int $trackingId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTrackingDetails(int $trackingId)
    {
        return \App\Models\TrackingDetail::where('tracking_id', $trackingId)->get();
    }

    /**
     * Delete a plan by ID.
     *
     * @param int $planId
     * @return bool|null
     */
    public function deletePlan(int $planId): ?bool
    {
        $plan = \App\Models\Plan::findOrFail($planId);
        return $plan->delete();
    }

    /**
     * Delete a tracking by ID.
     *
     * @param int $trackingId
     * @return bool|null
     */
    public function deleteTracking(int $trackingId): ?bool
    {
        $tracking = \App\Models\Tracking::findOrFail($trackingId);
        return $tracking->delete();
    }

    /**
     * Delete a tracking detail by ID.
     *
     * @param int $trackingDetailId
     * @return bool|null
     */
    public function deleteTrackingDetail(int $trackingDetailId): ?bool
    {
        $detail = \App\Models\TrackingDetail::findOrFail($trackingDetailId);
        return $detail->delete();
    }
}
