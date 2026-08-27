<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * EntityIdentity — authoritative identity object for ACCSYSTEM and each component product.
 *
 * System-owned: only platform.admin may update (Identity.md Invariant 2).
 * The four canonical entities may never be deleted (Identity.md Invariant 1).
 *
 * @property string $entity_id 'accsystem' | 'accore' | 'accommerce' | 'qayd'
 * @property string $schema_version
 * @property string $canonical_name 'ACCSYSTEM' | 'ACCORE' | 'ACCOMMERCE' | 'QAYD'
 * @property string $display_case 'uppercase' | 'lowercase_product'
 * @property string $tier 'corporate_parent' | 'component_product'
 * @property string $typographic_weight 'institutional' | 'operational'
 * @property array $positioning
 * @property array|null $color_tokens { primary, accent } — only ACCSYSTEM carries system-level tokens
 */
class EntityIdentity extends Model
{
    protected $table = 'entity_identities';

    protected $primaryKey = 'entity_id';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $guarded = [];

    // The four canonical system entities that may never be deleted
    private const SYSTEM_ENTITIES = ['accsystem', 'accore', 'accommerce', 'qayd'];

    // -------------------------------------------------------------------------
    // Casts
    // -------------------------------------------------------------------------

    protected function casts(): array
    {
        return [
            'positioning' => 'array',
            'color_tokens' => 'array',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function platform(): HasOne
    {
        return $this->hasOne(Platform::class, 'identity_ref', 'entity_id');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Whether this entity is one of the four system-owned canonical identities.
     */
    public function isSystemOwned(): bool
    {
        return in_array($this->entity_id, self::SYSTEM_ENTITIES, true);
    }

    /**
     * Display name honoring the TypographicRule (Identity.md).
     * ACCSYSTEM → 'ACCSYSTEM'; products → 'accore', 'accommerce', 'qayd'.
     */
    public function displayName(): string
    {
        return match ($this->display_case) {
            'uppercase' => strtoupper($this->canonical_name),
            'lowercase_product' => strtolower($this->canonical_name),
            default => $this->canonical_name,
        };
    }

    /**
     * Serialise as a rendering-contract identity token (Identity.md).
     */
    public function toIdentityToken(string $positioningTagline = ''): array
    {
        return [
            'entity_id' => $this->entity_id,
            'canonical_name' => $this->canonical_name,
            'display_name' => $this->displayName(),
            'display_case' => $this->display_case,
            'positioning_tagline' => $positioningTagline,
            'color_tokens' => $this->color_tokens,
        ];
    }
}
