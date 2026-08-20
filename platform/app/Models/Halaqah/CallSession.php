<?php

namespace App\Models\Halaqah;

use App\Models\Auth\User;
use App\Models\School\School;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CallSession extends Model
{
    protected $fillable = [
        'session_id',
        'school_id',
        'initiator_id',
        'target_id',
        'third_party_id',
        'status',
        'started_at',
        'ended_at',
        'duration_seconds',
        'metadata',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'metadata' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($session) {
            if (empty($session->session_id)) {
                $session->session_id = (string) Str::uuid();
            }
        });
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function initiator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiator_id');
    }

    public function target(): BelongsTo
    {
        return $this->belongsTo(User::class, 'target_id');
    }

    public function thirdParty(): BelongsTo
    {
        return $this->belongsTo(User::class, 'third_party_id');
    }
}
