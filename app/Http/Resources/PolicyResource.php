<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PolicyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'version' => $this->version,
            'last_updated' => $this->last_updated->toIso8601String(),
            'summary' => $this->summary_json,
            'sections' => $this->sections_json,
            'changelog' => $this->changelog,
            'is_active' => $this->is_active,
        ];
    }
}
