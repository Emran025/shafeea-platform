<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
{
    public function toArray($request)
    {
        $user = $this->user;
        return [
            'id' => $this->id,
            'bio' => $this->bio,
            'experience_years' => $this->experience_years,
            'name' => $user->name ?? null,
            'email' => $user->email ?? null,
            'avatar' => $user->avatar ?? null,
            'gender' => $user->gender ?? null,
            'birth_date' => $user->birth_date ?? null,
            'phone' => $user->phone ?? null,
            'whatsapp' => $user->whatsapp ?? null,
            'country' => $user->country ?? null,
            'city' => $user->city ?? null,
            'residence' => $user->residence ?? null,
            'status' => $user->status ?? null,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            // Add halaqahs or other relationships as needed
        ];
    }
} 