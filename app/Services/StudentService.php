<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\Halaqah;
use App\Models\Student;
use App\Models\User;
use App\Models\Plan;
use App\Models\Tracking;
use App\Models\TrackingDetail;
use App\Repositories\StudentRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentService
{
    protected $studentRepository;

    public function __construct(StudentRepository $studentRepository)
    {
        $this->studentRepository = $studentRepository;
    }

    public function createStudent(array $data)
    {
        return DB::transaction(function () use ($data) {
            $userData = [
                'name' => $data['name'] ?? null,
                'email' => $data['email'] ?? null,
                'password' => isset($data['password']) ? Hash::make($data['password']) : Hash::make('password'),
                'avatar' => $data['avatar'] ?? null,
                'gender' => $data['gender'] ?? null,
                'birth_date' => $data['birthDate'] ?? null,
                'phone_zone' => $data['phoneZone'] ?? null,
                'phone' => $data['phone'] ?? null,
                'whatsapp_zone' => $data['whatsappZone'] ?? null,
                'whatsapp' => $data['whatsappPhone'] ?? null,
                'country' => $data['country'] ?? null,
                'residence' => $data['residence'] ?? null,
                'city' => $data['city'] ?? null,
            ];

            $user = User::create($userData);
            
            $studentData = [
                'memorization_level' => $data['memorizationLevel'] ?? null,
                'qualification' => $data['qualification'] ?? null,
                'experience_years' => $data['experienceYears'] ?? 0,
                'status' => 'active',
            ];

            $student = $user->student()->create($studentData);

            return $student->fresh(['user', 'enrollments.halaqah']);
        });
    }

    public function updateStudent(int $userId, array $data)
    {
        return DB::transaction(function () use ($userId, $data) {
            $student = Student::where('user_id', $userId)->firstOrFail();
            
            if (isset($data['qualification'])) {
                $student->qualification = $data['qualification'];
            }
            
            if (isset($data['memorization_level'])) {
                $student->memorization_level = $data['memorization_level'];
            }
            
            if (isset($data['status'])) {
                $student->status = $data['status'];
            }
            
            $student->save();

            // All other fields in $data are assumed to be user fields in snake_case
            // excluding those already used for the student record
            $userFields = [
                'name', 'avatar', 'gender', 'birth_date', 'email', 'phone_zone', 
                'phone', 'whatsapp_zone', 'whatsapp', 'country', 'residence', 'city'
            ];

            $userData = array_intersect_key($data, array_flip($userFields));

            if (!empty($userData) && $student->user) {
                $student->user->update($userData);
            }

            return $student->fresh(['user', 'enrollments.halaqah']);
        });
    }

    public function enrollInHalaqah(int $userId, int $halaqahId)
    {
        $student = Student::where('user_id', $userId)->firstOrFail();
        $halaqah = Halaqah::findOrFail($halaqahId);
        
        return $halaqah->enrollments()->create([
            'student_id' => $student->id,
            'halaqah_id' => $halaqahId,
            'enrolled_at' => now(),
        ]);
    }

    public function leaveHalaqah(int $userId, int $halaqahId)
    {
        $student = Student::where('user_id', $userId)->firstOrFail();
        return Enrollment::where('student_id', $student->id)
            ->where('halaqah_id', $halaqahId)
            ->delete();
    }

    public function createPlan(int $userId, array $data)
    {
        return DB::transaction(function () use ($userId, $data) {
            $student = Student::where('user_id', $userId)->firstOrFail();
            $plan = Plan::create($data);
            
            $enrollment = Enrollment::where('student_id', $student->id)
                ->where('halaqah_id', $data['halaqah_id'])
                ->firstOrFail();

            DB::table('enrollment_plan')
                ->where('enrollment_id', $enrollment->id)
                ->update(['is_current' => false]);

            $enrollment->plans()->attach($plan->id, ['is_current' => true]);

            return $plan;
        });
    }

    public function updatePlan(int $planId, array $data)
    {
        $plan = Plan::findOrFail($planId);
        $plan->update($data);
        return $plan;
    }

    public function createTracking(int $enrollmentId, array $data)
    {
        return DB::transaction(function () use ($enrollmentId, $data) {
            $data['enrollment_id'] = $enrollmentId;
            
            if (isset($data['behaviorNote'])) {
                $data['behavior_note'] = $data['behaviorNote'];
                unset($data['behaviorNote']);
            }
            
            if (isset($data['attendanceTypeId'])) {
                $data['attendance_type_id'] = $data['attendanceTypeId'];
                unset($data['attendanceTypeId']);
            }

            $detailsData = $data['details'] ?? [];
            unset($data['details']);

            $tracking = Tracking::create($data);

            if (!empty($detailsData)) {
                foreach ($detailsData as $detailData) {
                    $this->addTrackingDetail($tracking->id, $detailData);
                }
            }

            return $tracking->load('details.mistakes');
        });
    }

    public function updateTracking(int $trackingId, array $data)
    {
        return DB::transaction(function () use ($trackingId, $data) {
            $tracking = Tracking::findOrFail($trackingId);

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

                $detail->mistakes()->delete();

                if (!empty($mistakesData)) {
                    $detail->mistakes()->createMany($mistakesData);
                }
            }

            return $tracking->load('details.mistakes');
        });
    }

    public function addTrackingDetail(int $trackingId, array $data)
    {
        return DB::transaction(function () use ($trackingId, $data) {
            $data['tracking_id'] = $trackingId;

            $mistakesData = $data['mistakes'] ?? [];
            unset($data['mistakes']);

            $trackingDetail = TrackingDetail::create($data);

            if (!empty($mistakesData)) {
                $trackingDetail->mistakes()->createMany($mistakesData);
            }

            return $trackingDetail->load('mistakes');
        });
    }
}
