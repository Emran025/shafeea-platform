<?php

namespace App\Listeners;

use App\Events\ContactInquiryRespondedEvent;
use App\Mail\Contacts\ContactInquiryResponseMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendContactInquiryResponseListener implements ShouldQueue
{
    public function handle(ContactInquiryRespondedEvent $event): void
    {
        $submitterEmail = $event->ticket->email;

        if ($submitterEmail) {
            Mail::to($submitterEmail)->queue(
                new ContactInquiryResponseMail($event->ticket, $event->responseMessage)
            );
        }
    }
}
