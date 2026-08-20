<?php

namespace App\Http\Requests\Cms;

use App\Models\Cms\Page;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Write-time validation for Page creation.
 *
 * Rules enforced:
 *   SR-001  slug must be unique across all pages
 *   WR-001  only one corporate.index page may exist per site_scope
 *   SR-006  hierarchy_depth may not exceed 2
 *
 * Field names match actual DB column names so validated() spreads directly
 * into Page::create().
 */
class StorePageRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'site_scope' => $this->route('school_code') ?? $this->get('site_scope'),
        ]);
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Core identity
            'slug'                    => 'required|string|max:300|unique:pages,slug',
            'type'                    => 'required|string|in:corporate.index,corporate.platform,corporate.about,corporate.contact,corporate.legal,corporate.home,editorial,editorial.press_release,utility,utility.comparison,platform.full_page,platform.features,platform.use_cases,pricing.overview,pricing.platform,pricing.compare,newsroom.article,newsroom.overview,newsroom.news,newsroom.stories,newsroom.about,solution.industry,solution.role,solution.business_type,solution.industry_tier,solution.tier_overview,industry.full_page,resource.blog_post,resource.report,resource.customer_story,resource.webinar,trust.overview,trust.section,campaign.landing,school.home,school.contact,school.legal,school.about,school.overview,school.news,school.stories,school.full_page',
            'site_scope'              => 'nullable|string|max:100',

            // PageIdentity columns
            'identity_title'          => 'nullable|array',
            'identity_title.*'        => 'nullable|string|max:500',
            'identity_purpose'        => 'nullable|array',
            'identity_purpose.*'      => 'nullable|string',
            'identity_owner'          => 'nullable|string|max:200',
            'identity_canonical_url'  => 'nullable|string|max:500',
            'identity_classification' => 'nullable|in:public,restricted',

            // PageHierarchy columns (SR-006 max depth 2)
            'parent_id'               => 'nullable|uuid|exists:pages,id',
            'hierarchy_depth'         => 'nullable|integer|min:0|max:2',
            'hierarchy_position'      => 'nullable|integer|min:0',
            'hierarchy_include_in_nav' => 'boolean',
            'hierarchy_nav_label'     => 'nullable|array',
            'hierarchy_nav_label.*'   => 'nullable|string|max:200',

            // PageCompositionPolicy columns
            'composition_section_order'   => 'nullable|string|max:50',
            'composition_allow_dynamic'   => 'nullable|boolean',
            'composition_max_sections'    => 'nullable|integer|min:1',
            'composition_fallback_policy' => 'nullable|string|max:100',

            // PageMeta columns
            'meta_seo_title'       => 'nullable|array',
            'meta_seo_description' => 'nullable|array',
            'meta_og_title'        => 'nullable|array',
            'meta_og_description'  => 'nullable|array',
            'meta_og_image'        => 'nullable|array',
            'meta_robots'          => 'nullable|string|max:200',
            'meta_schema_markup'   => 'nullable|string|max:100',
            'meta_hreflang'        => 'nullable|array',
        ];
    }

    public function withValidator($validator): void
    {
        // WR-001: only one corporate.index page per site_scope
        $validator->after(function ($v) {
            if ($this->get('type') === 'corporate.index') {
                $exists = Page::where('type', 'corporate.index')
                    ->where('site_scope', $this->get('site_scope'))
                    ->where('status', '!=', 'deleted')
                    ->exists();

                if ($exists) {
                    $v->errors()->add(
                        'type',
                        "WR-001: A corporate.index page already exists for site_scope '{$this->get('site_scope')}'. Only one is permitted."
                    );
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'slug.unique'          => 'SR-001: This slug is already in use. Choose a unique slug.',
            'hierarchy_depth.max'  => 'SR-006: Page hierarchy depth cannot exceed 2.',
        ];
    }
}
