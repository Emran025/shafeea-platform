<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'avatar',
        'phone',
        'country',
        'city',
        'location',
        'address',
    ];

    /**
     * Get the halaqahs for the school.
     */
    public function halaqahs()
    {
        return $this->hasMany(Halaqah::class);
    }
}
