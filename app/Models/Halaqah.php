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
     * The teachers that belong to the halaqah.
     */
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'halaqah_teacher')
            ->using(HalaqahTeacher::class)
            ->withPivot('assigned_at', 'note', 'is_current');
    }

    /**
     * Get the current teacher for the halaqah.
     */
    public function currentTeacher()
    {
        return $this->belongsToMany(Teacher::class, 'halaqah_teacher')
            ->wherePivot('is_current', true)
            ->using(HalaqahTeacher::class)
            ->withPivot('assigned_at', 'note', 'is_current');
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
    public function students()
    {
        return $this->hasManyThrough(
            Student::class,     
            Enrollment::class, 
            'halaqah_id',        
            'id',               
            'id',              
            'student_id'        
        );
    }

    /**
     * Accessor to get the current teacher.
     *
     * @return \App\Models\Teacher|null
     */
    public function getTeacherAttribute()
    {
        return $this->currentTeacher()->first();
    }
}
