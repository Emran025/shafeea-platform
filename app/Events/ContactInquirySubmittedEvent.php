<?php

namespace App\Events;

use App\Models\Content\HelpTicket;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContactInquirySubmittedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(public readonly HelpTicket $ticket) {}
}
