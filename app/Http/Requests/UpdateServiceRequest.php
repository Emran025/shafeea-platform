<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category' => 'required|string|in:management,education,analytics,communication,technology',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:50',
            'image' => 'nullable|string|max:500',
            'features' => 'nullable|array',
            'features.*' => 'string|max:500',
            'benefits' => 'nullable|array',
            'benefits.*' => 'string|max:255',
            'popular' => 'boolean',
            'theme' => 'required|string|in:blue,indigo,emerald,rose,amber,violet,cyan,orange',
            'display_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ];
    }
}
