<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HalaqahResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'avatar' => $this->avatar,
            'gender' => $this->gender ?? null,
            'residence' => $this->residence ?? null,
            'sumOfStudents' => $this->students ? $this->students->count() : 0,
            'MaxOfStudents'=>$this->max_students,
            'teacherId'=>$this->teacher_id,
            'isActive' => $this->is_active,
            'isDeleted' => $this->is_deleted,
            'createdAt' => $this->created_at->toIso8601String(),
            'updatedAt' => $this->updated_at->toIso8601String(),
        ];
    }
}
