<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'student_id',
        'halaqah_id',
        'enrolled_at',
    ];

    /**
     * Get the student for the enrollment.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the halaqah for the enrollment.
     */
    public function halaqah()
    {
        return $this->belongsTo(Halaqah::class);
    }

    /**
     * The plans that belong to the enrollment.
     */
    public function plans()
    {
        return $this->belongsToMany(Plan::class, 'enrollment_plan')->withTimestamps()->withPivot('is_current');
    }

    /**
     * Get the current (most recently attached) plan for the enrollment.
     * We order by the pivot created_at descending so the latest plan is always first,
     * regardless of whether is_current is set on the pivot row.
     */
    public function currentPlan()
    {
        return $this->belongsToMany(Plan::class, 'enrollment_plan')
            ->withPivot('is_current')
            ->withTimestamps()
            ->orderByPivot('created_at', 'desc');
    }

    /**
     * Get the trackings for the enrollment.
     */
    public function trackings()
    {
        return $this->hasMany(Tracking::class);
    }
}
