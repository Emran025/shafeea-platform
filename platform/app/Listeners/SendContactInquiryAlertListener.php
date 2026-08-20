<?php

namespace App\Listeners;

use App\Events\ContactInquirySubmittedEvent;
use App\Mail\Contacts\NewContactInquiryAlertMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendContactInquiryAlertListener implements ShouldQueue
{
    public function handle(ContactInquirySubmittedEvent $event): void
    {
        $contactEmail = config('mail.contact_email', config('mail.from.address'));

        if ($contactEmail) {
            Mail::to($contactEmail)->queue(new NewContactInquiryAlertMail($event->ticket));
        }
    }
}
