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
        'report_date',
        'summary',
        'details',
        'behavior',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'report_date' => 'date',
        'details' => 'array',  // Automatically decode JSON to array
        'behavior' => 'float',
    ];

    /**
     * Get the student that owns the report.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Scope to get recent reports.
     */
    public function scopeRecent($query, $limit = 10)
    {
        return $query->latest('report_date')->limit($limit);
    }

    /**
     * Accessor to get a readable behavior rating.
     */
    public function getBehaviorLabelAttribute()
    {
        $score = $this->behavior;

        if ($score === null) return 'غير معروف';

        if ($score >= 4.5) return 'ممتاز';
        if ($score >= 3.5) return 'جيد جداً';
        if ($score >= 2.5) return 'جيد';
        if ($score >= 1.5) return 'مقبول';
        return 'ضعيف';
    }
}