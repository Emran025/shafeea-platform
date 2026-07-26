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


    public function topics()
    {
        return $this->belongsToMany(Topic::class);
    }

    /**
     * Check whether this user's role carries a given permission code.
     * Result is cached per-request on the model instance to avoid repeated queries.
     */
    public function hasPermission(string $code): bool
    {
        if (! isset($this->_permissionCache)) {
            $this->_permissionCache = \Illuminate\Support\Facades\DB::table('role_permissions')
                ->join('permissions', 'permissions.id', '=', 'role_permissions.permission_id')
                ->where('role_permissions.role', $this->role)
                ->pluck('permissions.code')
                ->flip()
                ->all();
        }

        return isset($this->_permissionCache[$code]);
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
            'password' => 'hashed',
            'birth_date' => 'date',
        ];
    }

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
     * Relationships
     */
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

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
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
