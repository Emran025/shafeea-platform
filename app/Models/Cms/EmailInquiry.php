<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Auth\User;

class EmailInquiry extends Model
{
    protected $table = 'email_inquiries';

    protected $fillable = [
        'sender_name',
        'site_scope',
        'sender_email',
        'subject',
        'body',
        'status',
        'assigned_to',
        'notes',
        'received_at',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'received_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    /** The supervisor this inquiry is assigned to. */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /** Allowed status values. */
    public const STATUSES = ['new', 'open', 'resolved', 'archived'];
}
