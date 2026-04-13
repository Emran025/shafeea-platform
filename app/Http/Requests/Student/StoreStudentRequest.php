<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'avatar' => 'nullable|string',
            'gender' => 'required|in:Male,Female',
            'birthDate' => 'required|date',
            'phoneZone' => 'required|string',
            'phone' => 'required|string',
            'whatsappZone' => 'nullable|string',
            'whatsappPhone' => 'nullable|string',
            'country' => 'required|string',
            'residence' => 'required|string',
            'city' => 'required|string',
            'qualification' => 'required|string',
            'memorizationLevel' => 'required|integer|between:0,30',
            'status' => 'in:active,stopped,dropout',
        ];
    }
}
