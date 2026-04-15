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

        if (!$user) {
            return [
                'id' => $teacher->id,
                'error' => 'Missing user data',
            ];
        }

        return [
            'id' => $user->id,
            'name' => $user->name ?? null,
            'avatar' => $user->avatar ?? null,
            'gender' => $user->gender ?? null,
            'birthDate' => $user->birth_date instanceof \Illuminate\Support\Carbon ? $user->birth_date->toDateString() : $user->birth_date,
            'email' => $user->email ?? null,
            'phoneZone' => $user->phone_zone ?? null,
            'phone' => $user->phone ?? null,
            'whatsappZone' => $user->whatsapp_zone ?? null,
            'whatsappPhone' => $user->whatsapp ?? null,
            'country' => $user->country ?? null,
            'residence' => $user->residence ?? null,
            'city' => $user->city ?? null,
            'qualification' => $this->qualification,
            'experienceYears' => $this->experience_years,
            'status' => $this->calculated_status,
            'assignedHalaqas' => $this->whenLoaded('halaqahs', function () {
                return $this->halaqahs->map(function ($halaqa) {
                    return [
                        'id' => $halaqa->id,
                        'name' => $halaqa->name,
                        'avatar' => $halaqa->avatar,
                        'assignedAt' => $halaqa->pivot->assigned_at,
                    ];
                });
            }),
            'isDeleted' => (bool) $this->deleted_at,
            'updatedAt' => $teacher->updated_at instanceof \Illuminate\Support\Carbon ? $teacher->updated_at->toIso8601String() : $teacher->updated_at,
            'createdAt' => $teacher->created_at instanceof \Illuminate\Support\Carbon ? $teacher->created_at->toIso8601String() : $teacher->created_at,
        ];
    }
}
