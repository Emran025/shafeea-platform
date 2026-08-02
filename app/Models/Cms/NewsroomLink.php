<?php

namespace App\Models\Cms;

use Illuminate\Database\Eloquent\Model;

class NewsroomLink extends Model
{
    protected $table = 'newsroom_links';

    protected $fillable = [
        'label',
        'href',
        'position',
        'is_active',
    ];
}
