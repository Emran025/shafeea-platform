<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Model;

class NewsroomLink extends Model
{
    protected $fillable = [
        'label',
        'href',
        'position',
        'is_active',
    ];
}
