<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'super_admin',
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
