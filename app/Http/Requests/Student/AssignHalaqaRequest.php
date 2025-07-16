<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class AssignHalaqaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'halaqaId' => 'required|integer|exists:halaqahs,id',
            'studentId' => 'required|integer|exists:students,id',
        ];
    }
}
