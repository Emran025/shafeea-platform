<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HalaqahNote extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'halaqah_id',
        'admin_id',
        'note',
    ];

    /**
     * Get the halaqah that owns the note.
     */
    public function halaqah()
    {
        return $this->belongsTo(Halaqah::class);
    }

    /**
     * Get the admin that owns the note.
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
