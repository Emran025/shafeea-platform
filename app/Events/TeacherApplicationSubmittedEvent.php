<?php

namespace App\Events;

use App\Models\Applicant\Applicant;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeacherApplicationSubmittedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(public readonly Applicant $applicant) {}
}
