<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class School extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'logo',
        'phone',
        'country',
        'city',
        'location',
        'address',
    ];

    /**
     * Get the halaqahs for the school.
     */
    public function halaqahs()
    {
        return $this->hasMany(Halaqah::class);
    }
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function admin()
    {
        return $this->hasOneThrough(Admin::class, User::class);
    }
}
