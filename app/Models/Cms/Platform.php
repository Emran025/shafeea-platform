<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Platform Registry entry — represents one of the ACCSYSTEM component platforms.
 *
 * System-owned: may not be created or deleted through the content authoring workflow.
 * Only platform.admin may update (PlatformRegistry.md Rule 1).
 *
 * @property string $platform_id      e.g. 'accore'
 * @property string $schema_version
 * @property string $identity_ref     FK → entity_identities.entity_id
 * @property string $status           active | in_development | preview | deprecated
 * @property string $segment          enterprise_b2b | consumer_b2c | personal_smb | infrastructure
 * @property array  $target_users
 * @property array  $strategic_role   LocalizedString
 * @property array  $tagline          LocalizedString
 * @property array  $positioning      PlatformPositioning
 * @property array  $capabilities     PlatformCapability[]
 * @property array  $relationships    PlatformRelationship[]
 * @property array  $website_presence PlatformWebsitePresence
 */
class Platform extends Model
{
    protected $table      = 'platform_registry';
    protected $primaryKey = 'platform_id';
    protected $keyType    = 'string';
    public    $incrementing = false;

    protected $guarded = [];

    // -------------------------------------------------------------------------
    // Casts
    // -------------------------------------------------------------------------

    protected function casts(): array
    {
        return [
            'target_users'    => 'array',
            'strategic_role'  => 'array',
            'tagline'         => 'array',
            'positioning'     => 'array',
            'capabilities'    => 'array',
            'relationships'   => 'array',
            'website_presence' => 'array',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function entityIdentity(): BelongsTo
    {
        return $this->belongsTo(EntityIdentity::class, 'identity_ref', 'entity_id');
    }

    public function productSites(): HasMany
    {
        return $this->hasMany(ProductSite::class, 'platform_id', 'platform_id');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Resolved tagline for a given locale (falls back to 'en').
     */
    public function getTagline(string $locale = 'en'): string
    {
        $taglines = $this->tagline ?? [];
        return $taglines[$locale] ?? $taglines['en'] ?? '';
    }

    /**
     * Resolved strategic role for a given locale.
     */
    public function getStrategicRole(string $locale = 'en'): string
    {
        $roles = $this->strategic_role ?? [];
        return $roles[$locale] ?? $roles['en'] ?? '';
    }

    /**
     * Featured capabilities only (is_featured: true).
     * Used by platform_showcase sections (PlatformRegistry.md Rule 2).
     */
    public function featuredCapabilities(): array
    {
        return array_values(array_filter(
            $this->capabilities ?? [],
            fn(array $cap) => (bool) ($cap['is_featured'] ?? false)
        ));
    }

    /**
     * showcase_order from website_presence (PlatformRegistry.md Rule 4).
     */
    public function showcaseOrder(): int
    {
        return (int) (($this->website_presence ?? [])['showcase_order'] ?? 99);
    }
}
