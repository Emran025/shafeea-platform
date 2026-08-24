<?php

namespace App\Listeners;

use App\Events\StudentApplicationApprovedEvent;
use App\Mail\Students\StudentApprovedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendStudentApprovedEmailListener implements ShouldQueue
{
    public function handle(StudentApplicationApprovedEvent $event): void
    {
        $applicant = $event->applicant->load('user', 'school');

        if ($applicant->user?->email) {
            Mail::to($applicant->user->email)->queue(new StudentApprovedMail($applicant));
        }
    }
}
