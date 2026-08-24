<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublishBundleMember extends Model
{
    protected $table = 'publish_bundle_members';

    public $incrementing = false;
    public $timestamps   = false;

    protected $guarded = [];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function bundle(): BelongsTo
    {
        return $this->belongsTo(PublishBundle::class, 'bundle_id');
    }

    // -------------------------------------------------------------------------
    // Helpers — Polymorphic object resolution
    // -------------------------------------------------------------------------

    /**
     * Resolve the actual domain object (Page, Section, or Block) for this member.
     */
    public function resolveObject(): Page|Section|Block|null
    {
        return match ($this->object_type) {
            'page'    => Page::find($this->object_id),
            'section' => Section::find($this->object_id),
            'block'   => Block::find($this->object_id),
            default   => null,
        };
    }
}
