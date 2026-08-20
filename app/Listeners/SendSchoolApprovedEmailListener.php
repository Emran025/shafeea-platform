<?php

namespace App\Listeners;

use App\Events\SchoolApprovedEvent;
use App\Mail\Schools\SchoolApprovedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendSchoolApprovedEmailListener implements ShouldQueue
{
    public function handle(SchoolApprovedEvent $event): void
    {
        $school = $event->school->load('admin.user');

        $recipientEmail = optional(optional($school->admin)->user)->email;

        if ($recipientEmail) {
            Mail::to($recipientEmail)->queue(new SchoolApprovedMail($school));
        }
    }
}
