<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MistakeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'trackingDetailId' => $this->tracking_detail_id,
            'ayahId_quran' => $this->ayahId_quran,
            'wordIndex' => $this->wordIndex,
            'mistakeTypeId' => $this->mistakeTypeId,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
