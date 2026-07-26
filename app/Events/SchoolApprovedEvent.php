<?php

namespace App\Events;

use App\Models\School\School;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SchoolApprovedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(public readonly School $school) {}
}
