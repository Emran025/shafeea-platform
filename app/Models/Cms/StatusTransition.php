<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

// Append-only audit trail for every content state transition.
// Covers pages, sections, and blocks (Authoring.md — Authoring Audit Trail).
// Records: who transitioned, from/to states, when, and an optional note.
class StatusTransition extends Model
{
    use HasUuids;

    protected $table = 'status_transitions';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'transitioned_at' => 'datetime',
        ];
    }

    // -------------------------------------------------------------------------
    // Factory helper — the canonical way to record a transition
    // -------------------------------------------------------------------------

    public static function record(
        string $objectType,
        string $objectId,
        string $fromStatus,
        string $toStatus,
        string $transitionedBy,
        ?string $notes = null,
    ): self {
        return self::create([
            'object_type' => $objectType,
            'object_id' => $objectId,
            'from_status' => $fromStatus,
            'to_status' => $toStatus,
            'transitioned_by' => $transitionedBy,
            'transitioned_at' => now(),
            'notes' => $notes,
        ]);
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeForObject($query, string $type, string $id)
    {
        return $query->where('object_type', $type)->where('object_id', $id);
    }
}
