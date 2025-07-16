<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentApplicantResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'Avater' => $this->avatar ?? null,
            'gender' => $this->gender,
            'birthDate' => $this->birth_date,
            'email' => $this->email,
            'phoneZone' => $this->phone_zone,
            'phone' => $this->phone,
            'whatsappZone' => $this->whatsapp_zone,
            'whatsappPhone' => $this->whatsapp_phone,
            'country' => $this->country,
            'residence' => $this->residence,
            'city' => $this->city,
            'qualification' => $this->qualification,
            'memorizationLevel' => $this->memorization_level,
            'status' => $this->status,
            'note' => $this->note ?? null,
            'createdAt' => $this->created_at,
            'processedAt' => $this->processed_at ?? null,
        ];
    }
}
