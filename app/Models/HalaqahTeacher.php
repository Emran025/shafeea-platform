<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class HalaqahTeacher extends Pivot
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'halaqah_teacher';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'halaqah_id',
        'teacher_id',
        'assigned_at',
        'note',
        'is_current',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'assigned_at' => 'datetime',
        'is_current' => 'boolean',
    ];
}
