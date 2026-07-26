<?php

namespace App\Models\Tracking;

use App\Models\Student\Enrollment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tracking extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'enrollment_id',
        'date',
        'note',
        'behavior_note',
    ];

    /**
     * Get the enrollment for the tracking.
     */
    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    /**
     * Get the tracking details for the tracking.
     */
    public function details()
    {
        return $this->hasMany(TrackingDetail::class);
    }

    // App\Models\Tracking\Tracking.php
    public function trackingDetails()
    {
        return $this->hasMany(TrackingDetail::class);
    }
}
