<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlanRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'has_review' => 'boolean',
            'review_unit_id' => 'nullable|integer|exists:units,id',
            'review_amount' => 'nullable|integer',
            'has_memorization' => 'boolean',
            'memorization_unit_id' => 'nullable|integer|exists:units,id',
            'memorization_amount' => 'nullable|integer',
            'has_sard' => 'boolean',
            'sard_unit_id' => 'nullable|integer|exists:units,id',
            'sard_amount' => 'nullable|integer',
            'frequency_type_id' => 'required|integer|exists:frequency_types,id',
            'halaqah_id' => 'required|integer|exists:halaqahs,id',
            'enrolled_at' => 'nullable|date',
        ];
    }
}
