<?php

namespace App\Models\Auth;

use App\Models\Applicant\Applicant;
use App\Models\Content\Document;
use App\Models\School\School;
use App\Models\Cms\Topic;
use App\Models\Student\Student;
use App\Models\Teacher\Teacher;
use App\Notifications\CustomVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'phone',
        'phone_zone',
        'whatsapp',
        'whatsapp_zone',
        'gender',
        'birth_date',
        'country',
        'city',
        'residence',
        'status',
        'school_id',
        'is_active',
    ];

    /**
     * Transitive permission check: user → role_user → roles → permission_role → permissions.
     *
     * All permissions are aggregated from every role the user belongs to.
     * Result is cached per-request on the model instance.
     */
    public function hasPermission(string $code): bool
    {
        if (! isset($this->_permissionCache)) {
            $this->_permissionCache = DB::table('role_user')
                ->join('permission_role', 'permission_role.role_id', '=', 'role_user.role_id')
                ->join('permissions', 'permissions.id', '=', 'permission_role.permission_id')
                ->where('role_user.user_id', $this->id)
                ->pluck('permissions.code')
                ->flip()
                ->all();
        }

        return isset($this->_permissionCache[$code]);
    }

    /**
     * Check whether the user has a given role by its name slug.
     *
     * @example $user->hasRole('platform.admin')
     */
    public function hasRole(string $name): bool
    {
        // Use loaded collection if available to avoid extra query.
        if ($this->relationLoaded('roles')) {
            return $this->roles->contains('name', $name);
        }

        return $this->roles()->where('name', $name)->exists();
    }

    /**
     * Returns the name of the first (primary) role, or null if the user has no roles.
     * Used for display purposes and backward-compatible API responses.
     */
    public function primaryRoleName(): ?string
    {
        if ($this->relationLoaded('roles')) {
            return $this->roles->first()?->name;
        }

        return $this->roles()->value('roles.name');
    }

    // ── Relationships ────────────────────────────────────────────────────────

    /**
     * The roles this user belongs to (n-n via role_user pivot).
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * CMS content topics this user is assigned to (n-n via topic_user pivot).
     */
    public function topics()
    {
        return $this->belongsToMany(Topic::class);
    }

    public function student()
    {
        return $this->hasOne(Student::class);
    }

    public function teacher()
    {
        return $this->hasOne(Teacher::class);
    }

    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    public function applicant()
    {
        return $this->hasOne(Applicant::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    // ── Attribute overrides ──────────────────────────────────────────────────

    /**
     * Normalize email to lowercase on every write, regardless of entry
     * point (registration, applications, profile updates, admin-created
     * accounts, etc.). This guarantees "John@x.com" and "john@x.com" are
     * always the same stored value — case-insensitive matching must never
     * depend on database collation.
     */
    protected function setEmailAttribute(?string $value): void
    {
        $this->attributes['email'] = $value === null ? null : mb_strtolower(trim($value));
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'birth_date'        => 'date',
            'is_active'         => 'boolean',
        ];
    }

    /**
     * Override the default verification notification to use the platform's
     * branded template and the dedicated verify@ email alias.
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new CustomVerifyEmail);
    }
}
