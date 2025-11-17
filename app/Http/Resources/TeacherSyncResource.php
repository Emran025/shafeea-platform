<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherSyncResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $teacher = $this->resource;
        $user = $teacher->user;
        return [
            'id' => $teacher->id,
            'name' => $user->name ?? null,
            'avatar' => base64_encode($user->avatar ?? ''),
            'gender' => $user->gender ?? null,
            'birthDate' => $user->birth_date?->toDateString() ?? null,
            'email' => $user->email ?? null,
            'phoneZone' => '+967',
            'phone' => $user->phone ?? null,
            'whatsappZone' => $user->whatsapp_zone ?? null,
            'whatsappPhone' => $user->whatsapp ?? null,
            'country' => $user->country ?? null,
            'residence' => $user->residence ?? null,
            'city' => $user->city ?? null,
            'qualification' => $this->qualification,
            'experienceYears' => $this->experience_years,
            'status' => $this->status,
            'assignedHalaqas' => $this->whenLoaded('halaqahs', function () {
                return $this->halaqahs->map(function ($halaqa) {
                    return [
                        'id' => $halaqa->id,
                        'name' => $halaqa->name,
                        'avatar' => $halaqa->avatar, // تأكد من الحقل
                    ];
                });
            }),
            'isDeleted' => (bool) $this->deleted_at,
            'updatedAt' => $teacher->updated_at?->toIso8601String(),
            'createdAt' => $teacher->created_at?->toIso8601String(),
        ];
    }
}
