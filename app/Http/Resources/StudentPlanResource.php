<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentPlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $plan = $this->resource;
        $frequency = $plan?->frequencyType;

        return [
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
        ];
    }
}
