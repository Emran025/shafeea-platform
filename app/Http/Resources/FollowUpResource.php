<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FollowUpResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'PlanId' => $this->id,
            'frequency' => $this->frequency,
            'details' => $this->details,
            'updatedAt' => $this->updated_at,
            'createdAt' => $this->created_at,
        ];
    }
}
