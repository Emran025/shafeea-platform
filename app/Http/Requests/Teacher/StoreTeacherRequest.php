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
            'user.password' => 'required|string|min:8',
            'user.avatar' => 'nullable|string',
            'user.gender' => 'required|in:Male,Female',
            'user.birth_date' => 'required|date',
            'user.phone_zone' => 'required|string',
            'user.phone' => 'required|string',
            'user.whatsapp_zone' => 'nullable|string',
            'user.whatsapp' => 'nullable|string',
            'user.country' => 'required|string',
            'user.residence' => 'required|string',
            'user.city' => 'required|string',
        ];
    }
}
