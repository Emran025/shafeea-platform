<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $fillable = [
        'name_en',
        'name_ar',
        'phone_code',
        'iso2',
        'iso3',
        'flag_url',
        'flag_svg',
    ];
}
