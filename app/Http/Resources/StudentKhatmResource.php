<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentKhatmResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // $this->resource is a Student model instance
        return [
            'id' => $this->id,
            'name' => $this->user->name,
            'Avater' => $this->user->avatar,
            // Schema has no 'completionDate', using 'updated_at' as a placeholder
            'completionDate' => $this->updated_at->toIso8601String(),
        ];
    }
}