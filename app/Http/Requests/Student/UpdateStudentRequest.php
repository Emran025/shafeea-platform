<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $id = request()->route('id');
        return [
            'name' => 'sometimes|required|string|max:255',
            'avatar' => 'nullable|string',
            'gender' => 'sometimes|required|in:Male,Female',
            'birthDate' => 'sometimes|required|date',
            // 'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'phoneZone' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'whatsappZone' => 'nullable|string',
            'whatsappPhone' => 'nullable|string',
            'country' => 'sometimes|required|string',
            'residence' => 'sometimes|required|string',
            'city' => 'sometimes|required|string',
            'qualification' => 'sometimes|required|string',
            'memorizationLevel' => 'sometimes|required|string',
        ];
    }
}
