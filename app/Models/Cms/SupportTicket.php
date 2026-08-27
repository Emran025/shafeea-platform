<?php

namespace App\Models\Cms;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupportTicket extends Model
{
    protected $table = 'support_tickets';

    protected $fillable = [
        'ticket_number',
        'site_scope',
        'requester_name',
        'requester_email',
        'category',
        'priority',
        'subject',
        'body',
        'status',
        'assigned_to',
    ];

    /** The supervisor this ticket is assigned to. */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

    public const PRIORITIES = ['low', 'normal', 'high', 'urgent'];

    /**
     * Auto-generate a unique ticket number before creation.
     */
    protected static function booted(): void
    {
        static::creating(function (self $ticket): void {
            if (empty($ticket->ticket_number)) {
                $ticket->ticket_number = 'TKT-'.strtoupper(substr(uniqid(), -6));
            }
        });
    }
}
