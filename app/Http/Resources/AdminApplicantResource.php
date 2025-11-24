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
            'application_type' => $this->application_type,
            'status' => $this->status,
            'submitted_at' => $this->submitted_at,
            'user' => [
                'name' => $this->user->name,
                'gender' => $this->user->gender,
                'residence' => $this->user->residence,
                'city' => $this->user->city,
                'country' => $this->user->country,
                'email' => $this->user->email,
                'avatar' => $this->user->avatar,
            ],
            $this->mergeWhen(!$this->collection, [
                'bio' => $this->bio,
                'qualifications' => $this->qualifications,
                'intent_statement' => $this->intent_statement,
                'memorization_level' => $this->memorization_level,
            ]),
        ];
    }
}
