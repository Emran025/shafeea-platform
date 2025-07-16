<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property string $frequency
 * @property array $details
 */
class FollowUpRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'studentId' => 'required|integer|exists:students,id',
            'frequency' => 'required|string',
            'details' => 'required|array',
            'details.*.type' => 'required|string',
            'details.*.unit' => 'required|string',
            'details.*.amount' => 'required|integer',
        ];
    }
}
