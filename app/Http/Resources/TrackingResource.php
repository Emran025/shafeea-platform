<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TrackingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'planId' => $this->plan_id,
            'date' => $this->date,
            'note' => $this->note,
            'details'=> $this->details()?TrackingDetailResource::collection($this->whenLoaded('details')) : [],
            'behaviorNote' => $this->behavior_note,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
