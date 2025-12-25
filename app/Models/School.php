<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'current_plan_id',
        'subscription_status',
        'subscription_ends_at',
    ];

    /**
     * Get the current subscription plan for the school.
     */
    public function currentPlan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'current_plan_id');
    }

    /**
     * Get the subscriptions for the school.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

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

    public function students()
    {
        return $this->hasMany(User::class)->whereHas('student');
    }

    public function teachers()
    {
        return $this->hasMany(User::class)->whereHas('teacher');
    }
}
