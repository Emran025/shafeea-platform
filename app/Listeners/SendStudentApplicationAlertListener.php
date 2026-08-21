<?php

namespace App\Listeners;

use App\Events\StudentApplicationSubmittedEvent;
use App\Mail\Admins\NewStudentApplicationAlertMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendStudentApplicationAlertListener implements ShouldQueue
{
    public function handle(StudentApplicationSubmittedEvent $event): void
    {
        $applicant = $event->applicant->load('user', 'school.admin.user');

        $schoolAdminEmail = optional(optional(optional($applicant->school)->admin)->user)->email;

        if ($schoolAdminEmail) {
            Mail::to($schoolAdminEmail)->queue(new NewStudentApplicationAlertMail($applicant));
        }
    }
}
