<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // $this->resource is an Enrollment model instance
        return [
            'id' => $this->student->id,
            'name' => $this->student->user->name, // Assumes User relationship exists and has name
            'Avater' => $this->student->user->avatar, // Assumes User relationship exists and has avatar
            'enrolledAt' => optional($this->enrolled_at)->toIso8601String(),
            'leftAt' => optional($this->left_at)->toIso8601String(),
            'status' => $this->left_at ? 'dropped' : 'active',
        ];
    }
}