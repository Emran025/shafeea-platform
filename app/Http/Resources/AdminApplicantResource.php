<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminApplicantResource extends JsonResource
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
            'applicationType' => $this->application_type,
            'status' => $this->status,
            'submittedAt' => $this->submitted_at,
            'userId' => $this->user_id,
            'schoolId' => $this->school_id,
            'bio' => $this->bio,
            'qualifications' => $this->qualifications,
            'rejectionReason' => $this->rejection_reason,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'emailVerifiedAt' => $this->user->email_verified_at,
                'avatar' => $this->user->avatar,
                'phone' => $this->user->phone,
                'phoneZone' => $this->user->phone_zone,
                'whatsapp' => $this->user->whatsapp,
                'whatsappZone' => $this->user->whatsapp_zone,
                'gender' => $this->user->gender,
                'birthDate' => $this->user->birth_date,
                'country' => $this->user->country,
                'city' => $this->user->city,
                'residence' => $this->user->residence,
                'status' => $this->user->status,
                'schoolId' => $this->user->school_id,
                'createdAt' => $this->user->created_at,
                'updatedAt' => $this->user->updated_at,
                'deletedAt' => $this->user->deleted_at,
            ],
        ];
    }
}
