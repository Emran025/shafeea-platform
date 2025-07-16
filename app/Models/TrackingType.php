<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackingType extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the tracking units for this type.
     */
    public function trackingUnits()
    {
        return $this->hasMany(TrackingUnit::class);
    }
}
