<?php

namespace App\Models\Certificates;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasUuids;

    protected $guarded = [];

    protected $casts = ['fields_data' => 'array'];
}
