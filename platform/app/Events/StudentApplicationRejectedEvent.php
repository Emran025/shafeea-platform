<?php

namespace App\Events;

use App\Models\Applicant\Applicant;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StudentApplicationRejectedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Applicant $applicant,
        public readonly ?string $rejectionReason = null,
    ) {}
}
