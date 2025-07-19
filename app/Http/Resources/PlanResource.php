<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'startDate' => $this->start_date,
            'endDate' => $this->end_date,
            'hasReview' => $this->has_review,
            'reviewUnitId' => $this->review_unit_id,
            'reviewAmount' => $this->review_amount,
            'hasMemorization' => $this->has_memorization,
            'memorizationUnitId' => $this->memorization_unit_id,
            'memorizationAmount' => $this->memorization_amount,
            'hasSard' => $this->has_sard,
            'sardUnitId' => $this->sard_unit_id,
            'sardAmount' => $this->sard_amount,
            'frequencyTypeId' => $this->frequency_type_id,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
} 