<?php

namespace App\Listeners;

use App\Events\StudentEnrolledInHalaqahEvent;
use App\Mail\Students\StudentEnrolledMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendStudentEnrolledEmailListener implements ShouldQueue
{
    public function handle(StudentEnrolledInHalaqahEvent $event): void
    {
        $enrollment = $event->enrollment->load('student.user');

        $recipientEmail = optional(optional($enrollment->student)->user)->email;

        if ($recipientEmail) {
            Mail::to($recipientEmail)->queue(new StudentEnrolledMail($enrollment));
        }
    }
}
