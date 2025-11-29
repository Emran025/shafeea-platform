<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class TrackingDetail extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'tracking_id',
        'tracking_type_id',
        'from_tracking_unit_id',
        'to_tracking_unit_id',
        'actual_amount',
        'comment',
        'score',
    ];

    /**
     * Get the tracking for the detail.
     */
    public function tracking()
    {
        return $this->belongsTo(Tracking::class);
    }

    /**
     * Get the tracking type for the detail.
     */
    public function trackingType()
    {
        return $this->belongsTo(TrackingType::class);
    }

    /**
     * Get the from tracking unit for the detail.
     */
    public function fromTrackingUnit()
    {
        return $this->belongsTo(TrackingUnit::class, 'from_tracking_unit_id');
    }

    /**
     * Get the to tracking unit for the detail.
     */
    public function toTrackingUnit()
    {
        return $this->belongsTo(TrackingUnit::class, 'to_tracking_unit_id');
    }

    /**
     * Get the mistakes for the tracking detail.
     */
    public function mistakes()
    {
        return $this->hasMany(Mistake::class);
    }
}
