<?php

namespace App\Models\Certificates;

use Illuminate\Database\Eloquent\Model;

class CertificateTemplate extends Model
{
    protected $guarded = [];

    protected $casts = ['boxes_config' => 'array'];
}
