<?php

namespace App\Models\School;

use App\Models\Auth\Admin;
use App\Models\Auth\User;
use App\Models\Halaqah\Halaqah;
use App\Models\Subscription\Subscription;
use App\Models\Subscription\SubscriptionPlan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

class School extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        // ── Core identity ──────────────────────────────────────────────────────
        'name',
        'logo',
        'phone',
        'phone_zone',
        'country',
        'city',
        'location',
        'address',

        // ── Build identity ─────────────────────────────────────────────────────
        'school_code',          // globally unique slug; immutable after approval
        'is_active',            // true once approved
        'school_locked_mode',   // true → embed app_key in APK
        'approved_at',
        'app_key',              // cryptographically random; embedded in school-locked APKs

        // ── Build lifecycle ────────────────────────────────────────────────────
        'build_status',         // not_built | building | built | failed
        'last_built_at',
        'last_built_release',

        // ── Subscription ──────────────────────────────────────────────────────
        'current_plan_id',
        'subscription_status',
        'subscription_ends_at',

        // ── Per-school build configuration (sensitive) ─────────────────────────
        'keystore_file',            // base64-encoded JKS/PKCS12
        'keystore_store_password',  // stored encrypted; decrypted by accessor
        'keystore_key_alias',
        'keystore_key_password',    // stored encrypted; decrypted by accessor
        'build_notes',
    ];

    /**
     * The default logo to use when a school has no uploaded logo.
     * Stored in public/images/schools/school.svg — always accessible regardless of storage links.
     */
    const DEFAULT_LOGO = '/images/schools/school.svg';

    /**
     * Attribute casting.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active'            => 'boolean',
        'school_locked_mode'   => 'boolean',
        'approved_at'          => 'datetime',
        'last_built_at'        => 'datetime',
        'subscription_ends_at' => 'datetime',
    ];

    // ──────────────────────────────────────────────────────────────────────────
    // Accessors & Mutators
    // ──────────────────────────────────────────────────────────────────────────

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
        return Storage::disk('public')->url($value);
    }

    /**
     * ENCRYPTED MUTATOR — keystore_store_password.
     * Always encrypts before writing to the database so the raw password
     * is never stored in plain text.
     */
    public function setKeystoreStorePasswordAttribute(?string $value): void
    {
        $this->attributes['keystore_store_password'] = $value ? Crypt::encryptString($value) : null;
    }

    /**
     * ENCRYPTED ACCESSOR — keystore_store_password.
     * Transparently decrypts the value when read.
     */
    public function getKeystoreStorePasswordAttribute(?string $value): ?string
    {
        if (is_null($value)) {
            return null;
        }
        try {
            return Crypt::decryptString($value);
        } catch (\Exception) {
            return null; // Corrupted or unencrypted legacy value
        }
    }

    /**
     * ENCRYPTED MUTATOR — keystore_key_password.
     */
    public function setKeystoreKeyPasswordAttribute(?string $value): void
    {
        $this->attributes['keystore_key_password'] = $value ? Crypt::encryptString($value) : null;
    }

    /**
     * ENCRYPTED ACCESSOR — keystore_key_password.
     */
    public function getKeystoreKeyPasswordAttribute(?string $value): ?string
    {
        if (is_null($value)) {
            return null;
        }
        try {
            return Crypt::decryptString($value);
        } catch (\Exception) {
            return null;
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Query Scopes
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Scope: only approved & active schools.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: active schools that have NOT yet been built for a specific release.
     * Used by the Build API in "latest release rebuild" mode.
     */
    public function scopeNotBuiltForRelease($query, string $release)
    {
        return $query->active()
            ->where(function ($q) use ($release) {
                $q->whereNull('last_built_release')
                    ->orWhere('last_built_release', '!=', $release);
            });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helper Methods
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Whether this school has been approved (approved_at is set and is_active).
     */
    public function isApproved(): bool
    {
        return $this->is_active && !is_null($this->approved_at);
    }

    /**
     * Whether this school has complete build configuration needed by CI.
     */
    public function hasBuildConfig(): bool
    {
        return !is_null($this->keystore_file)
            && !is_null($this->keystore_store_password)
            && !is_null($this->keystore_key_alias)
            && !is_null($this->keystore_key_password);
    }

    /**
     * Return the public URL to the school's logo, suitable for embedding in
     * the Build API response (GitHub Actions downloads it from this URL).
     */
    public function getPublicLogoUrl(): string
    {
        return $this->logo; // The getLogoAttribute accessor already returns an absolute URL
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────────────────────────────────

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

    // ──────────────────────────────────────────────────────────────────────────
    // Template Context
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Returns a resolution context array for the TemplateResolver.
     *
     * Every {{school.*}} placeholder in the content JSON templates is resolved
     * against the values returned here. Add new keys here as the templates evolve.
     *
     * @param  string $locale  'en' | 'ar'
     * @return array           Keyed under 'school' so placeholders read {{school.name}} etc.
     */
    public function toTemplateContext(string $locale = 'en'): array
    {
        $phone = trim(($this->phone_zone ?? '') . ' ' . ($this->phone ?? ''));

        return [
            'school' => [
                'code'     => $this->school_code ?? $this->code ?? '',
                'name'     => $this->name ?? '',
                'logo'     => $this->logo,   // accessor returns full URL
                'phone'    => $phone,
                'email'    => '',            // not in schema yet; extend when added
                'country'  => $this->country  ?? '',
                'city'     => $this->city     ?? '',
                'address'  => $this->address  ?? '',
                'location' => $this->location ?? '',
            ],
        ];
    }
}
