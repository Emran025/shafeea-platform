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
            'behavior_note' => 'nullable|string',
            'details' => 'sometimes|array',
            'details.*.id' => 'nullable|integer|exists:tracking_details,id',
            'details.*.tracking_type_id' => 'required|integer|exists:tracking_types,id',
            'details.*.from_tracking_unit_id' => 'nullable|integer|exists:tracking_units,id',
            'details.*.to_tracking_unit_id' => 'nullable|integer|exists:tracking_units,id',
            'details.*.actual_amount' => 'nullable|integer',
            'details.*.comment' => 'nullable|string',
            'details.*.score' => 'nullable|numeric',
            'details.*.mistakes' => 'nullable|array',
            'details.*.mistakes.*.ayahId_quran' => 'required|integer',
            'details.*.mistakes.*.wordIndex' => 'required|integer',
            'details.*.mistakes.*.mistakeTypeId' => 'required|integer|between:0,124',
        ];
    }
}
