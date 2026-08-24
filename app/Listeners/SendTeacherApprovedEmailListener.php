<?php

namespace App\Listeners;

use App\Events\TeacherApplicationApprovedEvent;
use App\Mail\Teachers\TeacherApprovedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendTeacherApprovedEmailListener implements ShouldQueue
{
    public function handle(TeacherApplicationApprovedEvent $event): void
    {
        $applicant = $event->applicant->load('user', 'school');

        if ($applicant->user?->email) {
            Mail::to($applicant->user->email)->queue(new TeacherApprovedMail($applicant));
        }
    }
}
