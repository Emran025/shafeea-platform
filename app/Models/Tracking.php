<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tracking extends Model
{
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
}
