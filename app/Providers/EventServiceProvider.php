<?php

namespace App\Providers;

use App\Events\AdminLogin;
use App\Events\ApiLogin;
use App\Events\ContactInquiryRespondedEvent;
use App\Events\ContactInquirySubmittedEvent;
use App\Events\SchoolApprovedEvent;
use App\Events\SchoolRegistrationSubmittedEvent;
use App\Events\SchoolRejectedEvent;
use App\Events\StudentApplicationApprovedEvent;
use App\Events\StudentApplicationRejectedEvent;
use App\Events\StudentApplicationSubmittedEvent;
use App\Events\StudentEnrolledInHalaqahEvent;
use App\Events\TeacherApplicationApprovedEvent;
use App\Events\TeacherApplicationRejectedEvent;
use App\Events\TeacherApplicationSubmittedEvent;
use App\Listeners\LogAdminLoginSession;
use App\Listeners\LogApiLoginSession;
use App\Listeners\SendContactInquiryAlertListener;
use App\Listeners\SendContactInquiryResponseListener;
use App\Listeners\SendSchoolRegistrationAlertListener;
use App\Listeners\SendSchoolApprovedEmailListener;
use App\Listeners\SendSchoolRejectedEmailListener;
use App\Listeners\SendTeacherApplicationAlertListener;
use App\Listeners\SendTeacherApprovedEmailListener;
use App\Listeners\SendTeacherRejectedEmailListener;
use App\Listeners\SendStudentApplicationAlertListener;
use App\Listeners\SendStudentApprovedEmailListener;
use App\Listeners\SendStudentRejectedEmailListener;
use App\Listeners\SendStudentEnrolledEmailListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        // Auth
        ApiLogin::class => [
            LogApiLoginSession::class,
        ],
        AdminLogin::class => [
            LogAdminLoginSession::class,
        ],

        // Contact inquiries
        ContactInquirySubmittedEvent::class => [  // E-CNT-001
            SendContactInquiryAlertListener::class,
        ],
        ContactInquiryRespondedEvent::class => [  // E-CNT-002
            SendContactInquiryResponseListener::class,
        ],

        // School lifecycle
        SchoolRegistrationSubmittedEvent::class => [  // E-ADM-001
            SendSchoolRegistrationAlertListener::class,
        ],
        SchoolApprovedEvent::class => [               // E-SCH-001
            SendSchoolApprovedEmailListener::class,
        ],
        SchoolRejectedEvent::class => [               // E-SCH-002
            SendSchoolRejectedEmailListener::class,
        ],

        // Teacher application lifecycle
        TeacherApplicationSubmittedEvent::class => [  // E-ADM-002
            SendTeacherApplicationAlertListener::class,
        ],
        TeacherApplicationApprovedEvent::class => [   // E-TCH-001
            SendTeacherApprovedEmailListener::class,
        ],
        TeacherApplicationRejectedEvent::class => [   // E-TCH-002
            SendTeacherRejectedEmailListener::class,
        ],

        // Student application lifecycle
        StudentApplicationSubmittedEvent::class => [  // E-ADM-003
            SendStudentApplicationAlertListener::class,
        ],
        StudentApplicationApprovedEvent::class => [   // E-STU-001
            SendStudentApprovedEmailListener::class,
        ],
        StudentApplicationRejectedEvent::class => [   // E-STU-002
            SendStudentRejectedEmailListener::class,
        ],

        // Halaqah enrollment
        StudentEnrolledInHalaqahEvent::class => [     // E-STU-003
            SendStudentEnrolledEmailListener::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }
}
