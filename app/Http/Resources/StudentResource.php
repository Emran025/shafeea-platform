<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray($request)
    {

        $student = $this->resource;
        $enrollment = $student->enrollments->first();
        $plan = $enrollment?->plan;
        $halaqah = $enrollment?->halaqah;
        $user = $student->user;

        return [
            'id' => $this->id,
            'name' => $user->name ?? null,
            'avatar' => $user->avatar ?? null,
            'gender' => $user->gender ?? null,
            'birthDate' => $user->birth_date ?? null,
            'email' => $user->email ?? null,
            'phoneZone' => $user->phone_zone ?? null,
            'phone' => $user->phone ?? null,
            'whatsappZone' => $user->whatsapp_zone ?? null,
            'whatsappPhone' => $user->whatsapp ?? null,
            'country' => $user->country ?? null,
            'residence' => $user->residence ?? null,
            'city' => $user->city ?? null,
            $this->mergeWhen(!$this->collection, [
                'qualification' => $this->qualification,
                'memorizationLevel' => $this->memorization_level,
            ]),
            'status' => $this->status,
            'halaqa' => $halaqah ? [
                'id' => $halaqah->id,
                'name' => $halaqah->name,
                'avatar' => $halaqah->avatar,
                'assignedAt' => $enrollment->enrolled_at,
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
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
