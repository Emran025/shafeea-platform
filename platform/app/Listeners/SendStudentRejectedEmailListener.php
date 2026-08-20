<?php

namespace App\Listeners;

use App\Events\StudentApplicationRejectedEvent;
use App\Mail\Students\StudentRejectedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendStudentRejectedEmailListener implements ShouldQueue
{
    public function handle(StudentApplicationRejectedEvent $event): void
    {
        $applicant = $event->applicant->load('user', 'school');

        if ($applicant->user?->email) {
            Mail::to($applicant->user->email)->queue(
                new StudentRejectedMail($applicant, $event->rejectionReason)
            );
        }
    }
}
