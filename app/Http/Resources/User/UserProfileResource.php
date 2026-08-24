<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $role = $this->roles->first();

        return [
            'user' => [
                'id'               => $this->id,
                'name'             => $this->name,
                'email'            => $this->email,
                'phone'            => $this->phone,
                'avatar'           => $this->avatar,
                'username'         => $this->student?->username ?? $this->teacher?->username ?? $this->applicant?->username ?? null,
                'role'             => $role ? ['id' => $role->id, 'name' => $role->name] : null,
                'is_email_verified'=> (bool) $this->email_verified_at,
            ],
            'activeSessions' => [],
        ];
    }
}
