<?php

namespace App\Models;

use App\Enums\AdminStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'super_admin',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'status' => AdminStatus::class,
        'super_admin' => 'boolean',
    ];

    /**
     * Get the user for the admin.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the halaqah notes for the admin.
     */
    public function halaqahNotes()
    {
        return $this->hasMany(HalaqahNote::class);
    }
}
