<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackingUnit extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'unit_id',
        'from_surah',
        'from_page',
        'from_ayah',
        'to_surah',
        'to_page',
        'to_ayah',
    ];

    /**
     * Get the unit for the tracking unit.
     */
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * Get the tracking details where this is the from unit.
     */
    public function fromDetails()
    {
        return $this->hasMany(TrackingDetail::class, 'from_tracking_unit_id');
    }

    /**
     * Get the tracking details where this is the to unit.
     */
    public function toDetails()
    {
        return $this->hasMany(TrackingDetail::class, 'to_tracking_unit_id');
    }
}
