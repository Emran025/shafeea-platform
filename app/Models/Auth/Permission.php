<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'label',
    ];

    /**
     * The roles that carry this permission (n-n via permission_role).
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
}
