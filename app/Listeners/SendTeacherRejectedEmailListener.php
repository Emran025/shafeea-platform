<?php

namespace App\Listeners;

use App\Events\TeacherApplicationRejectedEvent;
use App\Mail\Teachers\TeacherRejectedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendTeacherRejectedEmailListener implements ShouldQueue
{
    public function handle(TeacherApplicationRejectedEvent $event): void
    {
        $applicant = $event->applicant->load('user', 'school');

        if ($applicant->user?->email) {
            Mail::to($applicant->user->email)->queue(
                new TeacherRejectedMail($applicant, $event->rejectionReason)
            );
        }
    }
}
