<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentSyncResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $student = $this->resource;
        $user = $student->user;

        if (!$user) {
            return [
                'id' => $student->id,
                'error' => 'Missing user data',
            ];
        }

        $enrollment = $student->enrollments->first();
        $plan = $enrollment?->currentPlan?->first();
        $frequency = $plan?->frequencyType;
        $halaqah = $enrollment?->halaqah;

        return [
            'id' => $user->id,
            'name' => $user->name ?? null,
            'avatar' => $user->avatar ?? null,
            'gender' => $user->gender ?? null,
            'birthDate' => $user->birth_date instanceof \Illuminate\Support\Carbon ? $user->birth_date->toDateString() : $user->birth_date,
            'email' => $user->email ?? null,
            'phoneZone' => $user->phone_zone ?? null,
            'phone' => $user->phone ?? null,
            'whatsappZone' => $user->whatsapp_zone ?? null,
            'whatsappPhone' => $user->whatsapp ?? null,
            'country' => $user->country ?? null,
            'residence' => $user->residence ?? null,
            'city' => $user->city ?? null,
            'bio' => $user->bio ?? null,
            'experienceYears' => $user->experience_years ?? 0,
            'availableTime' => $user->available_time ?? null,
            'stopReasons' => $user->stop_reasons ?? null,
            'qualification' => $student->qualification,
            'memorizationLevel' => $student->memorization_level,
            'status' => $student->status,
            'halaqa' => $halaqah ? [
                'id' => $halaqah->id,
                'enrollmentId' => $enrollment->id,
                'name' => $halaqah->name,
                'avatar' => $halaqah->avatar,
                'assignedAt' => $enrollment->enrolled_at,
            ] : null,
            'followUpPlan' => $plan ? [
                'planId' => $plan->id,
                'frequency' => $frequency?->name ?? 'daily',
                'details' => [
                    [
                        'type' => 'memorization',
                        'unit' => $plan->memorizationUnit?->name_ar ?? '1',
                        'amount' => $plan->memorization_amount,
                    ],
                    [
                        'type' => 'review',
                        'unit' => $plan->reviewUnit?->name_ar ?? '1',
                        'amount' => $plan->review_amount,
                    ],
                    [
                        'type' => 'recitation',
                        'unit' => $plan->sardUnit?->name_ar ?? '1',
                        'amount' => $plan->sard_amount,
                    ],
                ],
                'updatedAt' => $plan->updated_at instanceof \Illuminate\Support\Carbon ? $plan->updated_at->toIso8601String() : $plan->updated_at,
                'createdAt' => $plan->created_at instanceof \Illuminate\Support\Carbon ? $plan->created_at->toIso8601String() : $plan->created_at,
            ] : [
                'planId' => '1',
                'frequency' => 'daily',
                'details' => [],
                'updatedAt' => now()->toIso8601String(),
                'createdAt' => now()->toIso8601String(),
            ],
            'isDeleted' => (bool) $student->is_deleted,
            'updatedAt' => $student->updated_at instanceof \Illuminate\Support\Carbon ? $student->updated_at->toIso8601String() : $student->updated_at,
            'createdAt' => $student->created_at instanceof \Illuminate\Support\Carbon ? $student->created_at->toIso8601String() : $student->created_at,
        ];
    }
}
