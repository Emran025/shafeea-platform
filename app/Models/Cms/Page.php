<?php

namespace App\Models\Cms;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'pages';

    protected $guarded = [];

    /**
     * Default attribute values.
     * meta_hreflang is nullable at the DB level (MySQL <8.0.13 forbids JSON defaults),
     * so we supply the empty-array default here instead.
     */
    protected $attributes = [
        'meta_hreflang' => '[]',
    ];

    // -------------------------------------------------------------------------
    // Casts
    // -------------------------------------------------------------------------

    protected function casts(): array
    {
        return [
            // PageIdentity
            'identity_title' => 'array',
            'identity_purpose' => 'array',

            // PageHierarchy
            'hierarchy_include_in_nav' => 'boolean',
            'hierarchy_nav_label' => 'array',
            'breadcrumb_label' => 'array',

            // PageCompositionPolicy
            'composition_allow_dynamic' => 'boolean',

            // PageMeta
            'meta_seo_title' => 'array',
            'meta_seo_description' => 'array',
            'meta_og_title' => 'array',
            'meta_og_description' => 'array',
            'meta_og_image' => 'array',
            'meta_hreflang' => 'array',

            // AuditRecord
            'published_at' => 'datetime',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships — Hierarchy (self-referential)
    // -------------------------------------------------------------------------

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Page::class, 'parent_id');
    }

    // -------------------------------------------------------------------------
    // Relationships — Sections
    // -------------------------------------------------------------------------

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class, 'page_id');
    }

    // -------------------------------------------------------------------------
    // Relationships — Audit (Users)
    // FK constraints to users are deferred — see migration comment
    // -------------------------------------------------------------------------

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function lastModifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_modified_by');
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }

    // -------------------------------------------------------------------------
    // Accessor bridges — map CompositionService property names to DB columns
    // -------------------------------------------------------------------------

    public function getIncludeInNavAttribute(): bool
    {
        return (bool) $this->hierarchy_include_in_nav;
    }

    public function getNavDepthAttribute(): int
    {
        return (int) ($this->hierarchy_depth ?? 0);
    }

    public function getNavPositionAttribute(): int
    {
        return (int) ($this->hierarchy_position ?? 0);
    }

    public function getNavLabelsAttribute(): array
    {
        return $this->hierarchy_nav_label ?? [];
    }

    public function getBreadcrumbLabelsAttribute(): array
    {
        return $this->breadcrumb_label ?? [];
    }

    public function getCompositionPolicyAttribute(): array
    {
        return [
            'fallback_policy' => $this->composition_fallback_policy ?? 'show_partial',
            'max_sections' => $this->composition_max_sections ?? PHP_INT_MAX,
        ];
    }

    public function getPageMetaAttribute(): array
    {
        $locales = [];

        $seoTitle = $this->meta_seo_title ?? [];
        $seoDesc = $this->meta_seo_description ?? [];
        $ogTitle = $this->meta_og_title ?? [];
        $ogDesc = $this->meta_og_description ?? [];
        $robots = $this->meta_robots ?? 'index,follow';
        $schema = $this->meta_schema_markup ?? null;

        $allLocales = array_unique(array_merge(
            array_keys($seoTitle),
            array_keys($seoDesc),
            ['en'],
        ));

        foreach ($allLocales as $locale) {
            $locales[$locale] = [
                'seo_title' => $seoTitle[$locale] ?? $seoTitle['en'] ?? '',
                'seo_description' => $seoDesc[$locale] ?? $seoDesc['en'] ?? '',
                'og_title' => $ogTitle[$locale] ?? $ogTitle['en'] ?? null,
                'og_description' => $ogDesc[$locale] ?? $ogDesc['en'] ?? null,
                'robots' => $robots,
                'schema_markup' => $schema,
            ];
        }

        return $locales;
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopePubliclyVisible($query)
    {
        return $query->where('identity_classification', 'public');
    }

    public function scopeInNav($query)
    {
        return $query->where('hierarchy_include_in_nav', true);
    }
}
