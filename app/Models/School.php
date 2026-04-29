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
     * The default logo to use when a school has no uploaded logo.
     * Stored in public/images/schools/school.svg — always accessible regardless of storage links.
     */
    const DEFAULT_LOGO = '/images/schools/school.svg';

    /**
     * Get the full URL for the school logo.
     * Handles three path types:
     *   1. Full URL (http/https)     → return as-is  (e.g. CDN or external image)
     *   2. Absolute public path (/)  → return as-is  (e.g. /images/schools/school.svg)
     *   3. Relative storage path     → prepend /storage/ prefix (e.g. schools/logos/xxx.png)
     *   4. null / empty              → return the default placeholder logo
     */
    public function getLogoAttribute($value): string
    {
        if (!$value) {
            return self::DEFAULT_LOGO;
        }
        // Full external URL
        if (str_starts_with($value, 'http')) {
            return $value;
        }
        // Already an absolute path to the public directory (e.g. /images/...)
        if (str_starts_with($value, '/')) {
            return $value;
        }
        // Relative path stored via Storage::disk('public') — needs /storage/ prefix
        return \Illuminate\Support\Facades\Storage::disk('public')->url($value);
    }

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
