<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Tracking extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'plan_id',
        'date',
        'note',
        'behavior_note',
    ];

    /**
     * Get the plan for the tracking.
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Get the tracking details for the tracking.
     */
    public function details()
    {
        return $this->hasMany(TrackingDetail::class);
    }
    // App\Models\Tracking.php
public function trackingDetails()
{
    return $this->hasMany(TrackingDetail::class);
}

}
