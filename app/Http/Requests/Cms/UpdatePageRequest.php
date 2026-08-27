<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Write-time validation for Page updates.
 *
 * Rules enforced:
 *   SR-001  slug uniqueness (excluding the current page)
 *   SR-006  hierarchy_depth limit
 *   Type immutability: page type may not be changed (enforced here)
 *
 * Field names match actual DB column names so validated() spreads directly
 * into Page::fill().
 */
class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $pageId = $this->route('page');

        return [
            // Core
            'slug' => "sometimes|string|max:300|unique:pages,slug,{$pageId}",
            'site_scope' => 'sometimes|string|max:100',
            // type is excluded — page type is immutable after creation

            // PageIdentity
            'identity_title' => 'sometimes|array',
            'identity_title.*' => 'nullable|string|max:500',
            'identity_purpose' => 'sometimes|array',
            'identity_purpose.*' => 'nullable|string',
            'identity_owner' => 'sometimes|nullable|string|max:200',
            'identity_canonical_url' => 'sometimes|nullable|string|max:500',
            'identity_classification' => 'sometimes|in:public,restricted',

            // PageHierarchy (SR-006 max depth 2)
            'parent_id' => 'sometimes|nullable|uuid|exists:pages,id',
            'hierarchy_depth' => 'sometimes|integer|min:0|max:2',
            'hierarchy_position' => 'sometimes|integer|min:0',
            'hierarchy_include_in_nav' => 'sometimes|boolean',
            'hierarchy_nav_label' => 'sometimes|array',
            'hierarchy_nav_label.*' => 'nullable|string|max:200',

            // PageCompositionPolicy
            'composition_section_order' => 'sometimes|nullable|string|max:50',
            'composition_allow_dynamic' => 'sometimes|nullable|boolean',
            'composition_max_sections' => 'sometimes|nullable|integer|min:1',
            'composition_fallback_policy' => 'sometimes|nullable|string|max:100',

            // PageMeta
            'meta_seo_title' => 'sometimes|nullable|array',
            'meta_seo_description' => 'sometimes|nullable|array',
            'meta_og_title' => 'sometimes|nullable|array',
            'meta_og_description' => 'sometimes|nullable|array',
            'meta_og_image' => 'sometimes|nullable|array',
            'meta_robots' => 'sometimes|nullable|string|max:200',
            'meta_schema_markup' => 'sometimes|nullable|string|max:100',
            'meta_hreflang' => 'sometimes|nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'slug.unique' => 'SR-001: This slug is already in use by another page.',
            'hierarchy_depth.max' => 'SR-006: Page hierarchy depth cannot exceed 2.',
        ];
    }
}
