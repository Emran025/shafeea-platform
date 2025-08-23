<?php

namespace App\Http\Requests\School;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSchoolRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Add authorization logic as needed
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('schools', 'name')->ignore($this->route('school')),
            ],
            'phone' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'location' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'logo' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'School name is required.',
            'name.unique' => 'A school with this name already exists.',
            'phone.required' => 'Phone number is required.',
            'country.required' => 'Country is required.',
            'city.required' => 'City is required.',
            'location.required' => 'Location is required.',
            'address.required' => 'Address is required.',
        ];
    }
}