<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Write-time validation for Section creation.
 *
 * Rules enforced:
 *   SR-002  section belongs to exactly one page (page_id required + FK check)
 *   identity_anchor_id uniqueness within the sections table
 *   Valid section types per the engine domain model
 *
 * Field names match actual DB column names so validated() spreads directly
 * into Section::create().
 */
class StoreSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // SR-002: must belong to one page
            'page_id'               => 'required|uuid|exists:pages,id',
            'type'                  => 'required|string|in:hero,feature_highlight,platform_showcase,platform_card_grid,content,cta_strip,rich_text,media_block,form,faq,contact,custom,prose_body',

            // SectionIdentity columns
            'identity_name'         => 'nullable|string|max:200',
            'identity_anchor_id'    => 'nullable|string|max:200|unique:sections,identity_anchor_id',
            'identity_owner'        => 'nullable|string|max:200',
            'identity_purpose'      => 'nullable|array',

            // SectionOrdering columns
            'ordering_position'     => 'nullable|integer|min:0',
            'ordering_is_pinned'    => 'nullable|boolean',
            'ordering_group'        => 'nullable|string|max:100',

            // SectionCompositionPolicy columns
            'composition_min_blocks'       => 'nullable|integer|min:0',
            'composition_max_blocks'       => 'nullable|integer|min:1',
            'composition_required_types'   => 'nullable|array',
            'composition_locale_strategy'  => 'nullable|string|max:100',

            // SectionVisibility columns
            'visibility_audience'      => 'nullable|array',
            'visibility_visible_from'  => 'nullable|date',
            'visibility_visible_until' => 'nullable|date',
            'visibility_locale_filter' => 'nullable|array',
            'visibility_flag'          => 'nullable|array',

            // Styling columns
            'background_image_url' => 'nullable|string|max:2048',
            'custom_css_classes'   => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'page_id.exists'            => 'The referenced page does not exist.',
            'identity_anchor_id.unique' => 'This anchor_id is already in use by another section.',
            'type.in'                   => 'Invalid section type. Refer to the engine domain model for valid types.',
        ];
    }
}
