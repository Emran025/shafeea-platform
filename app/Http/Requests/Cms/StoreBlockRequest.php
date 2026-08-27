<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Write-time validation for Block creation.
 *
 * locale_content must be provided as an array keyed by locale.
 * Each locale entry should have: { is_complete: bool, fields: {} }
 *
 * Note: block type is set at creation and is immutable thereafter (SR-005).
 * The SR-005 constraint is also enforced by BlockObserver on any subsequent update.
 *
 * Field names match actual DB column names so validated() spreads directly
 * into Block::create().
 */
class StoreBlockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // SR-005: type is required and immutable after creation
            'type' => 'required|string|max:100',

            // locale_content: keyed by locale — at least 'en' should be present
            'locale_content' => 'required|array',
            'locale_content.en' => 'required|array',
            'locale_content.en.fields' => 'required|array',
            'locale_content.*.is_complete' => 'nullable|boolean',

            // Media reference
            'media_id' => 'nullable|uuid|exists:media,id',

            // Actions (CTAs, links)
            'actions' => 'nullable|array',

            // Composition config — actual column names
            'config_is_decorative' => 'nullable|boolean',
            'config_is_featured' => 'nullable|boolean',
            'config_display_weight' => 'nullable|integer|min:1|max:10',
        ];
    }

    public function messages(): array
    {
        return [
            'locale_content.en.required' => "locale_content must include an 'en' (English) entry.",
            'locale_content.en.fields.required' => "The 'en' locale entry must include a 'fields' object.",
        ];
    }
}
