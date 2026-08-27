<?php

namespace App\Models\Cms;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Block extends Model
{
    use HasUuids;

    protected $table = 'blocks';

    protected $guarded = [];

    protected $appends = ['content'];

    /**
     * Default attribute values.
     * JSON columns are nullable at the DB level (MySQL <8.0.13 forbids JSON defaults),
     * so we supply their defaults here instead.
     */
    protected $attributes = [
        'locale_content' => '{}',
        'actions' => '[]',
        'references' => '[]',
    ];

    // -------------------------------------------------------------------------
    // Casts
    // -------------------------------------------------------------------------

    protected function casts(): array
    {
        return [
            // Map<LocaleCode, BlockContent> — type-specific content keyed by locale
            'locale_content' => 'array',

            // ActionReference[]
            'actions' => 'array',

            // ContentReference[]
            'references' => 'array',

            // BlockConfig
            'config_is_decorative' => 'boolean',
            'config_is_featured' => 'boolean',

            // AuditRecord
            'published_at' => 'datetime',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships — Sections (inverse of BlockReference pivot)
    // -------------------------------------------------------------------------

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class, 'section_block')
            ->using(SectionBlock::class)
            ->withPivot('position', 'is_required');
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id');
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
    // Accessor bridges — map CompositionService property names to DB columns
    // -------------------------------------------------------------------------

    public function getContentAttribute(): ?array
    {
        return $this->locale_content;
    }

    public function getIsDecorativeAttribute(): bool
    {
        return (bool) ($this->config_is_decorative ?? false);
    }

    public function getIsFeaturedAttribute(): bool
    {
        return (bool) ($this->config_is_featured ?? false);
    }

    public function getDisplayWeightAttribute(): int
    {
        return (int) ($this->config_display_weight ?? 5);
    }

    // -------------------------------------------------------------------------
    // Helpers — Locale content resolution
    // -------------------------------------------------------------------------

    /**
     * Retrieve the BlockContent for a given locale, with optional fallback to 'en'.
     */
    public function resolveLocale(string $locale = 'en'): ?array
    {
        $content = $this->locale_content ?? [];

        return $content[$locale] ?? $content['en'] ?? null;
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
