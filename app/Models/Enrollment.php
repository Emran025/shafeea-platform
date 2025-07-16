<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
        'plan_id',
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
     * Get the plan for the enrollment.
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
