<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFaqRequest extends FormRequest
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
            'category_id' => 'sometimes|required|exists:faq_categories,id',
            'school_id' => 'nullable|exists:schools,id',
            'question' => 'sometimes|required|string',
            'answer' => 'sometimes|required|string',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
