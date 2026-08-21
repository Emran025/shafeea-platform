<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Auth\User;

class Media extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'media';

    protected $guarded = [];

    /**
     * Default attribute values.
     * JSON columns are nullable at the DB level (MySQL <8.0.13 forbids JSON defaults),
     * so we supply their defaults here instead.
     */
    protected $attributes = [
        'identity_tags'     => '[]',
        'delivery_variants' => '[]',
        'locale_meta'       => '{}',
    ];

    protected function casts(): array
    {
        return [
            'identity_tags'       => 'array',
            'delivery_variants'   => 'array',
            'delivery_is_public'  => 'boolean',
            'locale_meta'         => 'array',
            'published_at'        => 'datetime',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function lastModifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_modified_by');
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(Block::class, 'media_id');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Whether this media object is usable in a published block (Media Invariant 1).
     */
    public function isReady(): bool
    {
        return $this->status === 'ready';
    }

    /**
     * Resolve alt_text and caption for a given locale.
     * Falls back to 'en' if requested locale is absent.
     */
    public function resolveLocaleMeta(string $locale = 'en'): ?array
    {
        $meta = $this->locale_meta ?? [];

        return $meta[$locale] ?? $meta['en'] ?? null;
    }

    /**
     * Find the "original" variant (Media Invariant 4 — must always exist for image.*).
     */
    public function originalVariant(): ?array
    {
        return collect($this->delivery_variants ?? [])
            ->firstWhere('label', 'original');
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeReady($query)
    {
        return $query->where('status', 'ready');
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
