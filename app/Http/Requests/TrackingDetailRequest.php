<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackingDetailRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'tracking_type_id' => 'required|integer|exists:tracking_types,id',
            'from_tracking_unit_id' => 'nullable|integer|exists:tracking_units,id',
            'to_tracking_unit_id' => 'nullable|integer|exists:tracking_units,id',
            'actual_amount' => 'nullable|integer',
            'comment' => 'nullable|string',
            'score' => 'nullable|numeric',
            'mistakes' => 'nullable|array',
            'mistakes.*.ayahId_quran' => 'required|integer',
            'mistakes.*.wordIndex' => 'required|integer',
            'mistakes.*.mistakeTypeId' => 'required|integer|between:0,124',
        ];
    }
}
