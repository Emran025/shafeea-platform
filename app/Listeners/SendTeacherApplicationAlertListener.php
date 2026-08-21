<?php

namespace App\Listeners;

use App\Events\TeacherApplicationSubmittedEvent;
use App\Mail\Admins\NewTeacherApplicationAlertMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendTeacherApplicationAlertListener implements ShouldQueue
{
    public function handle(TeacherApplicationSubmittedEvent $event): void
    {
        $applicant = $event->applicant->load('user', 'school.admin.user');

        $schoolAdminEmail = optional(optional(optional($applicant->school)->admin)->user)->email;

        if ($schoolAdminEmail) {
            Mail::to($schoolAdminEmail)->queue(new NewTeacherApplicationAlertMail($applicant));
        }
    }
}
