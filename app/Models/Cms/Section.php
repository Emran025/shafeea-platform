<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Auth\User;

class Section extends Model
{
    use HasUuids;

    protected $table = 'sections';

    protected $guarded = [];

    /**
     * Default attribute values.
     * JSON columns are nullable at the DB level (MySQL <8.0.13 forbids JSON defaults),
     * so we supply their defaults here instead.
     */
    protected $attributes = [
        'composition_required_types' => '[]',
        'visibility_audience'        => '["public"]',
    ];

    // -------------------------------------------------------------------------
    // Casts
    // -------------------------------------------------------------------------

    protected function casts(): array
    {
        return [
            // SectionOrdering
            'ordering_is_pinned' => 'boolean',

            // SectionCompositionPolicy
            // Stores BlockType[] — e.g. ["headline", "rich_text"]
            'composition_required_types' => 'array',

            // VisibilityPolicy
            // Stores AudienceType[] — e.g. ["public"] | ["authenticated"]
            'visibility_audience'      => 'array',
            'visibility_visible_from'  => 'datetime',
            'visibility_visible_until' => 'datetime',

            // AuditRecord
            'published_at' => 'datetime',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships — Parent Page
    // -------------------------------------------------------------------------

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'page_id');
    }

    // -------------------------------------------------------------------------
    // Relationships — Blocks (via BlockReference pivot)
    // -------------------------------------------------------------------------

    public function blocks(): BelongsToMany
    {
        return $this->belongsToMany(Block::class, 'section_block')
            ->using(SectionBlock::class)
            ->withPivot('position', 'is_required')
            ->orderByPivot('position');
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

    public function getAnchorIdAttribute(): ?string
    {
        return $this->identity_anchor_id;
    }

    public function getPositionAttribute(): int
    {
        return (int) ($this->ordering_position ?? 1);
    }

    public function getGroupAttribute(): ?string
    {
        return $this->ordering_group;
    }

    public function getCompositionPolicyAttribute(): array
    {
        return [
            'min_blocks'      => (int) ($this->composition_min_blocks ?? 0),
            'required_types'  => $this->composition_required_types ?? [],
            'locale_strategy' => $this->composition_locale_strategy ?? 'fallback',
        ];
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeComposable($query)
    {
        return $query->whereIn('status', ['published', 'hidden']);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('ordering_position');
    }
}
