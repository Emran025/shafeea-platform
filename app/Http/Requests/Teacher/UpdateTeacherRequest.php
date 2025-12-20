<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeacherRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $id = request()->route('id');

        return [
            'bio' => 'nullable|string',
            'experience_years' => 'nullable|integer|min:0',
            'user.name' => 'sometimes|required|string|max:255',
            'user.email' => 'sometimes|required|email|unique:users,email,'.$id,
            // Add other user fields as needed
        ];
    }
}
