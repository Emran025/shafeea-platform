<?php

namespace App\Enums;

enum AdminStatus: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case REJECTED = 'rejected';
    case SUSPENDED = 'suspended';
}
