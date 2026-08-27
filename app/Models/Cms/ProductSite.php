<?php

namespace App\Models\Cms;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductSite extends Model
{
    protected $table = 'product_sites';

    // PK is a canonical string identifier — e.g. "site.accore"
    protected $primaryKey = 'site_id';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $guarded = [];

    /**
     * Default attribute values.
     * JSON columns are nullable at the DB level (MySQL <8.0.13 forbids JSON defaults),
     * so we supply their defaults here instead.
     */
    protected $attributes = [
        'urls_localized' => '{}',
    ];

    // -------------------------------------------------------------------------
    // Casts
    // -------------------------------------------------------------------------

    protected function casts(): array
    {
        return [
            // ProductSiteIdentity
            'identity_site_label' => 'array',
            'identity_short_description' => 'array',
            'identity_ecosystem_role' => 'array',

            // ProductSiteUrls
            'urls_localized' => 'array',

            // GatewayPageConfig
            'gateway_has_gateway_page' => 'boolean',
            'gateway_include_in_nav' => 'boolean',
            'gateway_nav_label' => 'array',
            'gateway_cta_label' => 'array',
            'gateway_unavailable_label' => 'array',

            // ProductSiteDisplay
            'display_show_in_platform_index' => 'boolean',
            'display_show_in_nav' => 'boolean',
            'display_show_in_homepage_showcase' => 'boolean',
            'display_media_ref' => 'array',

            // url_health maintained by external monitoring
            'url_health' => 'boolean',

            // AuditRecord
            'published_at' => 'datetime',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships — Gateway Page
    // -------------------------------------------------------------------------

    /**
     * The corporate.product_gateway Page on the ACCSYSTEM site for this product.
     * Null when gateway_has_gateway_page is false.
     */
    public function gatewayPage(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'gateway_page_id');
    }

    // -------------------------------------------------------------------------
    // Relationships — Audit (Users)
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
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Whether this product site's CTA is safe to expose in a public contract.
     * Mirrors the composition engine rule: status must be "live" AND url_health must be true.
     */
    public function isCtaAvailable(): bool
    {
        return $this->status === 'live' && $this->url_health === true;
    }

    /**
     * Resolve the canonical URL for a given locale.
     * Falls back to urls_canonical if no locale-specific URL is registered.
     */
    public function resolveCanonicalUrl(string $locale = 'en'): ?string
    {
        $localized = $this->urls_localized ?? [];

        return $localized[$locale] ?? $this->urls_canonical;
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeLive($query)
    {
        return $query->where('status', 'live');
    }

    public function scopeInHomepageShowcase($query)
    {
        return $query->where('display_show_in_homepage_showcase', true)
            ->orderBy('gateway_showcase_order');
    }

    public function scopeInNav($query)
    {
        return $query->where('display_show_in_nav', true);
    }
}
