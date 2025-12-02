<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TrackingDetailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'trackingId' => $this->tracking_id,
            'trackingTypeId' => $this->tracking_type_id,
            'fromTrackingUnitId' => $this->from_tracking_unit_id,
            'toTrackingUnitId' => $this->to_tracking_unit_id,
            'actualAmount' => $this->actual_amount,
            'gap' => $this->gap,
            'comment' => $this->comment,
            'score' => $this->score,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'mistakes' => MistakeResource::collection($this->whenLoaded('mistakes')),
        ];
    }
}
