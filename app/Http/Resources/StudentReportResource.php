<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class StudentReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'studentId' => $this->student_id,
            'trackDate' => $this->report_date instanceof Carbon ? $this->report_date->toDateString() : $this->report_date,
            'summary' => $this->summary,
            'attendance' => $this->details['attendance'] ?? 'present',
            'behaviourAssessment' => $this->behavior,
            'details' => $this->details ?? [],
            'updatedAt' => $this->updated_at instanceof Carbon ? $this->updated_at->toIso8601String() : $this->updated_at,
            'createdAt' => $this->created_at instanceof Carbon ? $this->created_at->toIso8601String() : $this->created_at,
        ];
    }
}
