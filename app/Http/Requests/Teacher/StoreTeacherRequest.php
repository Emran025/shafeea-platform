<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'bio' => 'nullable|string',
            'experience_years' => 'nullable|integer|min:0',
            'user.name' => 'required|string|max:255',
            'user.email' => 'required|email|unique:users,email',
            // Add other user fields as needed
        ];
    }
}
