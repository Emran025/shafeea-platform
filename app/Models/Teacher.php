<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'bio',
        'experience_years',
    ];

    /**
     * Get the user for the teacher.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The halaqahs that belong to the teacher.
     */
    public function halaqahs()
    {
        return $this->belongsToMany(Halaqah::class, 'halaqah_teacher')
            ->using(HalaqahTeacher::class)
            ->withPivot('assigned_at', 'note', 'is_current');
    }

    /**
     * Get the teacher's calculated status.
     */
    public function getCalculatedStatusAttribute(): int
    {
        $isActive = $this->halaqahs()
            ->where('is_active', true)
            ->wherePivot('is_current', true)
            ->exists();

        return $isActive ? 1 : 2;
    }
}
