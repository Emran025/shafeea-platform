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
            'email' => ['required', 'string', 'email', 'max:255'],
            'bio' => ['required', 'string'],
            'qualifications' => ['required', 'string'],
            'intent_statement' => ['required', 'string'],
            'memorization_level' => ['required', 'integer'],
        ];
    }
}
