<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackingRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'date' => 'required|date',
            'note' => 'nullable|string',
            'behaviorNote' => 'nullable|integer',
            'attendanceTypeId' => 'nullable|integer|exists:attendance_types,id',
            'details' => 'sometimes|array',
            'details.*.id' => 'nullable|integer|exists:tracking_details,id',
            'details.*.trackingTypeId' => 'required|integer|exists:tracking_types,id',
            'details.*.fromTrackingUnitId' => 'nullable|integer|exists:tracking_units,id',
            'details.*.toTrackingUnitId' => 'nullable|integer|exists:tracking_units,id',
            'details.*.actualAmount' => 'nullable|integer',
            'details.*.comment' => 'nullable|string',
            'details.*.score' => 'nullable|numeric',
            'details.*.mistakes' => 'nullable|array',
            'details.*.mistakes.*.ayahId_quran' => 'required|integer',
            'details.*.mistakes.*.wordIndex' => 'required|integer',
            'details.*.mistakes.*.mistakeTypeId' => 'required|integer|between:0,124',
        ];
    }
}
