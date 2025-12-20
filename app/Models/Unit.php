<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'name_ar',
    ];

    /**
     * Get the tracking units for the unit.
     */
    public function trackingUnits()
    {
        return $this->hasMany(TrackingUnit::class);
    }

    /**
     * Get the plans where this unit is used as review_unit.
     */
    public function reviewPlans()
    {
        return $this->hasMany(Plan::class, 'review_unit_id');
    }

    /**
     * Get the plans where this unit is used as memorization_unit.
     */
    public function memorizationPlans()
    {
        return $this->hasMany(Plan::class, 'memorization_unit_id');
    }

    /**
     * Get the plans where this unit is used as sard_unit.
     */
    public function sardPlans()
    {
        return $this->hasMany(Plan::class, 'sard_unit_id');
    }
}
