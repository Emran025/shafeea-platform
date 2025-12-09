<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'bio' => ['required', 'string'],
            'qualifications' => ['required', 'file', 'min:1024', 'max:20480'],
            'intent_statement' => ['required', 'file', 'min:1024', 'max:20480'],
            'memorization_level' => ['required', 'integer'],
        ];
    }
}
