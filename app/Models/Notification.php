<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type', 'title', 'message', 'read', 'user_id', 'scheduled_for'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 