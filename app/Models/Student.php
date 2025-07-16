<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'qualification',
        'memorization_level',
        'status',
    ];

    /**
     * Get the user for the student.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the enrollments for the student.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get the reports for the student.
     */
    public function reports()
    {
        return $this->hasMany(StudentReport::class);
    }
}
