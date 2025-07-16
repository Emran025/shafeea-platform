<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentReport extends Model
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
        'date',
        'attendance',
        'behavior',
        'notes',
        'created_by',
    ];

    /**
     * Get the student for this report.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the halaqah for this report.
     */
    public function halaqah()
    {
        return $this->belongsTo(Halaqah::class);
    }

    /**
     * Get the user who created this report.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
