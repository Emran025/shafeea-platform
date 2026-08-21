<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePolicyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'version' => 'required|string|max:50',
            'last_updated' => 'required|date',
            'summary_json' => 'required|json',
            'sections_json' => 'required|json',
            'changelog' => 'nullable|string',
            'required_consent' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
