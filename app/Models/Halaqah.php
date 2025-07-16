<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Halaqah extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'avatar',
        'gender',
        'residence',
        'max_students',
        'sum_of_students',
        'is_active',
        'is_deleted',
        'teacher_id',
        'school_id',
    ];

    /**
     * Get the school that owns the halaqah.
     */
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Get the teacher that owns the halaqah.
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Get the schedules for the halaqah.
     */
    public function schedules()
    {
        return $this->hasMany(HalaqahSchedule::class);
    }

    /**
     * Get the notes for the halaqah.
     */
    public function notes()
    {
        return $this->hasMany(HalaqahNote::class);
    }

    /**
     * Get the enrollments for the halaqah.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
