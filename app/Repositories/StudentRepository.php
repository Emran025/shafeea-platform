<?php

namespace App\Repositories;

use App\Models\Enrollment;
use App\Models\Halaqah;
use App\Models\Student;
use App\Models\StudentReport;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

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

    public function find($userId)
    {
        return Student::with([
            'user',
            'enrollments' => function ($query) {
                $query->latest('enrolled_at')->limit(1);
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

    public function update($userId, $data)
    {
        $student = Student::where('user_id', $userId)->firstOrFail();
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
        if (! empty($userData) && $student->user) {
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
            'enrollments.currentPlan.frequencyType',
            'enrollments.currentPlan.reviewUnit',
            'enrollments.currentPlan.memorizationUnit',
            'enrollments.currentPlan.sardUnit',
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
     */
    public function delete(int $id): ?bool
    {
        $student = Student::findOrFail($id);

        return $student->delete();
    }

    /**
     * Register a student to a halaqah.
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
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getReports(int $studentId)
    {
        return StudentReport::where('student_id', $studentId)->get();
    }

    /**
     * Get all halaqahs student is enrolled in.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getHalaqahs(int $studentId)
    {
        return Student::findOrFail($studentId)->enrollments()->with('halaqah')->get()->pluck('halaqah');
    }

    /**
     * Check if student is enrolled in a specific halaqah.
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
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getPlans(int $studentId)
    {
        return Enrollment::where('student_id', $studentId)
            ->with('plans')
            ->get()
            ->pluck('plans')
            ->flatten();
    }

    /**
     * Get the active plan for a student (most recent enrollment).
     *
     * @return Plan|null
     */
    public function getActivePlan(int $studentId)
    {
        $enrollment = Enrollment::where('student_id', $studentId)
            ->orderByDesc('enrolled_at')
            ->with('currentPlan')
            ->first();

        // currentPlan is a relationship that returns a collection, get the first one
        return $enrollment && $enrollment->currentPlan->isNotEmpty() ? $enrollment->currentPlan->first() : null;
    }

    /**
     * Create a new plan and enroll the student in it.
     *
     * @return Plan
     */
    public function createPlan(int $studentId, array $data)
    {
        $plan = \App\Models\Plan::create($data);
        $enrollment = Enrollment::where('student_id', $studentId)
            ->where('halaqah_id', $data['halaqah_id'])
            ->firstOrFail();

        // Set all other plans for this enrollment to not be current
        DB::table('enrollment_plan')->where('enrollment_id', $enrollment->id)->update(['is_current' => false]);

        // Attach the new plan as the current one
        $enrollment->plans()->attach($plan->id, ['is_current' => true]);

        return $plan;
    }

    /**
     * Update an existing plan.
     *
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
     * @param  int  $planId
     * @return Tracking
     */
    public function createTracking(int $enrollmentId, array $data)
    {
        return DB::transaction(function () use ($enrollmentId, $data) {
            $data['enrollment_id'] = $enrollmentId;

            $detailsData = [];
            if (isset($data['details'])) {
                $detailsData = $data['details'];
                unset($data['details']);
            }

            $tracking = \App\Models\Tracking::create($data);

            if (! empty($detailsData)) {
                foreach ($detailsData as $detailData) {
                    $this->addTrackingDetail($tracking->id, $detailData);
                }
            }

            return $tracking->load('details.mistakes');
        });
    }

    /**
     * Update a tracking.
     *
     * @return Tracking
     */
    public function updateTracking(int $trackingId, array $data)
    {
        return DB::transaction(function () use ($trackingId, $data) {
            $tracking = \App\Models\Tracking::findOrFail($trackingId);

            $detailsData = $data['details'] ?? [];
            unset($data['details']);

            $tracking->update($data);

            $detailIds = collect($detailsData)->pluck('id')->filter();
            $tracking->details()->whereNotIn('id', $detailIds)->delete();

            foreach ($detailsData as $detailData) {
                $mistakesData = $detailData['mistakes'] ?? [];
                unset($detailData['mistakes']);

                $detail = $tracking->details()->updateOrCreate(
                    ['id' => $detailData['id'] ?? null],
                    $detailData
                );

                foreach ($detail->mistakes as $mistake) {
                    $mistake->delete();
                }

                if (! empty($mistakesData)) {
                    $detail->mistakes()->createMany($mistakesData);
                }
            }

            return $tracking->load('details.mistakes');
        });
    }

    /**
     * Add a tracking detail to a tracking.
     *
     * @return TrackingDetail
     */
    public function addTrackingDetail(int $trackingId, array $data)
    {
        return DB::transaction(function () use ($trackingId, $data) {
            $data['tracking_id'] = $trackingId;

            $mistakesData = [];
            if (isset($data['mistakes'])) {
                $mistakesData = $data['mistakes'];
                unset($data['mistakes']);
            }

            $trackingDetail = \App\Models\TrackingDetail::create($data);

            if (! empty($mistakesData)) {
                $trackingDetail->mistakes()->createMany($mistakesData);
            }

            return $trackingDetail->load('mistakes');
        });
    }

    /**
     * Get all trackings for a student (via all their plans).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTrackingsForStudent(int $studentId)
    {
        $enrollmentIds = Enrollment::where('student_id', $studentId)->pluck('id');

        return \App\Models\Tracking::whereIn('enrollment_id', $enrollmentIds)->with(['details'])->get();
    }

    /**
     * Get all tracking details for a tracking.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTrackingDetails(int $trackingId)
    {
        return \App\Models\TrackingDetail::where('tracking_id', $trackingId)->get();
    }

    /**
     * Delete a plan by ID.
     */
    public function deletePlan(int $planId): ?bool
    {
        $plan = \App\Models\Plan::findOrFail($planId);

        return $plan->delete();
    }

    /**
     * Delete a tracking by ID.
     */
    public function deleteTracking(int $trackingId): ?bool
    {
        $tracking = \App\Models\Tracking::findOrFail($trackingId);

        return $tracking->delete();
    }

    /**
     * Delete a tracking detail by ID.
     */
    public function deleteTrackingDetail(int $trackingDetailId): ?bool
    {
        $detail = \App\Models\TrackingDetail::findOrFail($trackingDetailId);

        return $detail->delete();
    }
}
