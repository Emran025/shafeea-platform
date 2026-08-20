<?php

namespace App\Listeners;

use App\Events\SchoolRejectedEvent;
use App\Mail\Schools\SchoolRejectedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendSchoolRejectedEmailListener implements ShouldQueue
{
    public function handle(SchoolRejectedEvent $event): void
    {
        $school = $event->school->load('admin.user');

        $recipientEmail = optional(optional($school->admin)->user)->email;

        if ($recipientEmail) {
            Mail::to($recipientEmail)->queue(new SchoolRejectedMail($school, $event->rejectionReason));
        }
    }
}
