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
        $enrollment = $student->enrollments->first();
        $plan = $enrollment?->plan;
        $frequency = $plan?->frequencyType;
        $halaqah = $enrollment?->halaqah;
        $user = $student->user;

        return [
            'id' => $student->id,
            'name' => $user->name ?? null,
            'avatar' => base64_encode($user->avatar ?? ''),
            'gender' => $user->gender ?? null,
            'birthDate' => $user->birth_date?->toDateString() ?? null,
            'email' => $user->email ?? null,
            'phoneZone' => '+967',
            'phone' => $user->phone ?? null,
            'whatsappZone' => $user->whatsapp_zone ?? null,
            'whatsappPhone' => $user->whatsapp ?? null,
            'country' => $user->country ?? null,
            'residence' => $user->residence ?? null,
            'city' => $user->city ?? null,
            'qualification' => $student->qualification,
            'memorizationLevel' => $student->memorization_level,
            'status' => $student->status,
            'halaqa' => $halaqah ? [
                'id' => $halaqah->id,
                'name' => $halaqah->name,
            ] : null,
            'followUpPlan' => $plan ? [
                'PlanId' => $plan->id,
                'frequency' => $frequency->name ?? null,
                'details' => [
                    [
                        'type' => 'memorization',
                        'unit' => $plan->memorizationUnit?->name_ar ?? 'unit',
                        'amount' => $plan->memorization_amount,
                    ],
                    [
                        'type' => 'review',
                        'unit' => $plan->reviewUnit?->name_ar ?? 'unit',
                        'amount' => $plan->review_amount,
                    ],
                    [
                        'type' => 'recitation',
                        'unit' => $plan->sardUnit?->name_ar ?? 'unit',
                        'amount' => $plan->sard_amount,
                    ],
                ],
                'updatedAt' => $plan->updated_at?->toIso8601String() ?? null,
                'createdAt' => $plan->created_at?->toIso8601String() ?? null,
            ] : null,
            'isDeleted' => (bool)$student->is_deleted,
            'updatedAt' => $student->updated_at?->toIso8601String(),
            'createdAt' => $student->created_at?->toIso8601String(),
        ];
    }
}
