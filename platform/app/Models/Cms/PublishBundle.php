<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Auth\User;

// Coordinated publish bundle (Publishing.md).
// Groups multiple content objects for atomic simultaneous publication.
// WR-006: all members must be in 'approved' status for the bundle to publish.
class PublishBundle extends Model
{
    use HasUuids;

    protected $table = 'publish_bundles';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function members(): HasMany
    {
        return $this->hasMany(PublishBundleMember::class, 'bundle_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // -------------------------------------------------------------------------
    // Helpers — WR-006 enforcement
    // -------------------------------------------------------------------------

    /**
     * Validate that all bundle members are in 'approved' status.
     * Returns ['valid' => bool, 'failing_members' => array].
     */
    public function validateAllMembersApproved(): array
    {
        $failingMembers = [];

        foreach ($this->members as $member) {
            $model = $member->resolveObject();
            if ($model === null || $model->status !== 'approved') {
                $failingMembers[] = [
                    'object_type' => $member->object_type,
                    'object_id'   => $member->object_id,
                    'status'      => $model?->status ?? 'not_found',
                ];
            }
        }

        return [
            'valid'           => empty($failingMembers),
            'failing_members' => $failingMembers,
        ];
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeStaging($query)
    {
        return $query->where('status', 'staging');
    }

    public function scopeReady($query)
    {
        return $query->where('status', 'ready');
    }
}
