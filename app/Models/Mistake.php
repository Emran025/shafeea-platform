<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mistake extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tracking_detail_id',
        'ayahId_quran',
        'wordIndex',
        'mistakeTypeId',
    ];

    public function trackingDetail()
    {
        return $this->belongsTo(TrackingDetail::class);
    }
}
