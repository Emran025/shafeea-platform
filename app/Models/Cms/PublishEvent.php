<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

// Append-only publish audit trail (Publishing.md — Publish Audit Trail).
// Every publish, schedule, unpublish, and bundle publish event is recorded here.
// Accessible only to content.publisher and platform.admin roles.
// Never exposed in rendering contracts.
class PublishEvent extends Model
{
    use HasUuids;

    protected $table = 'publish_events';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'triggered_at' => 'datetime',
            'validation_result' => 'array',
        ];
    }

    // -------------------------------------------------------------------------
    // Factory helper
    // -------------------------------------------------------------------------

    public static function record(
        string $eventType,
        string $objectType,
        string $objectId,
        string $triggeredBy,
        string $previousStatus,
        string $resultingStatus,
        ?array $validationResult = null,
        ?string $notes = null,
    ): self {
        return self::create([
            'event_type' => $eventType,
            'object_type' => $objectType,
            'object_id' => $objectId,
            'triggered_by' => $triggeredBy,
            'triggered_at' => now(),
            'previous_status' => $previousStatus,
            'resulting_status' => $resultingStatus,
            'validation_result' => $validationResult,
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
