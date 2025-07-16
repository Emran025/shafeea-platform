<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Plan extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'has_review',
        'review_unit_id',
        'review_amount',
        'has_memorization',
        'memorization_unit_id',
        'memorization_amount',
        'has_sard',
        'sard_unit_id',
        'sard_amount',
        'frequency_type_id',
    ];

    /**
     * Get the enrollments for the plan.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get the trackings for the plan.
     */
    public function trackings()
    {
        return $this->hasMany(Tracking::class);
    }

    /**
     * Get the frequency type for the plan.
     */
    public function frequencyType()
    {
        return $this->belongsTo(FrequencyType::class);
    }

    /**
     * Get the review unit for the plan.
     */
    public function reviewUnit()
    {
        return $this->belongsTo(Unit::class, 'review_unit_id');
    }

    /**
     * Get the memorization unit for the plan.
     */
    public function memorizationUnit()
    {
        return $this->belongsTo(Unit::class, 'memorization_unit_id');
    }

    /**
     * Get the sard unit for the plan.
     */
    public function sardUnit()
    {
        return $this->belongsTo(Unit::class, 'sard_unit_id');
    }
}
