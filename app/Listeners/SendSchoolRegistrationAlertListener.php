<?php

namespace App\Listeners;

use App\Events\SchoolRegistrationSubmittedEvent;
use App\Mail\Admins\NewSchoolApplicationAlertMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendSchoolRegistrationAlertListener implements ShouldQueue
{
    public function handle(SchoolRegistrationSubmittedEvent $event): void
    {
        $school = $event->school->load('admin.user');

        $adminEmail = config('mail.platform_admin_email', config('mail.from.address'));

        if ($adminEmail) {
            Mail::to($adminEmail)->queue(new NewSchoolApplicationAlertMail($school));
        }
    }
}
