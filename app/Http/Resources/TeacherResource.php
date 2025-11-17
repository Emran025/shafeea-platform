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
            'experienceYears' => $this->experience_years,
            'name' => $user->name ?? null,
            'email' => $user->email ?? null,
            'avatar' => $user->avatar ?? null,
            'gender' => $user->gender ?? null,
            'birthDate' => $user->birth_date ?? null,
            'phoneZone' => $user->phone_zone ?? null,
            'phone' => $user->phone ?? null,
            'whatsappZone' => $user->whatsapp_zone ?? null,
            'whatsappPhone' => $user->whatsapp ?? null,
            'country' => $user->country ?? null,
            'city' => $user->city ?? null,
            'residence' => $user->residence ?? null,
            'status' => $user->status ?? null,
            'assignedHalaqas' => $this->whenLoaded('halaqahs', function () {
                return $this->halaqahs->map(function ($halaqa) {
                    return [
                        'id' => $halaqa->id,
                        'name' => $halaqa->name,
                        'avatar' => $halaqa->avatar, // تأكد من الحقل
                        'assignedAt' => $halaqa->created_at,
                    ];
                });
            }),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            // Add halaqahs or other relationships as needed
        ];
    }
}
