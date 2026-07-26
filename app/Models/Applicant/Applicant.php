<?php

namespace App\Models\Applicant;

use App\Models\Applicant\ApplicantRejection;
use App\Models\Auth\User;
use App\Models\School\School;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Applicant extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'applicants';

    protected $fillable = [
        'user_id',
        'school_id',
        'application_type',
        'status',
        'bio',
        'qualifications',
        'memorization_level',
        'rejection_reason',
        'submitted_at',
        'username',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($applicant) {
            if (empty($applicant->username)) {
                $name = 'applicant';
                if ($applicant->user) {
                    $name = $applicant->user->name;
                } elseif ($applicant->user_id) {
                    $user = \App\Models\Auth\User::find($applicant->user_id);
                    if ($user) {
                        $name = $user->name;
                    }
                }
                $applicant->username = \App\Services\Auth\UsernameGenerator::generate($name);
            }
        });
    }

    /**
     * Normalize username to lowercase on every write. Case-insensitive
     * matching must never depend on database collation.
     */
    protected function setUsernameAttribute(?string $value): void
    {
        $this->attributes['username'] = $value === null ? null : mb_strtolower(trim($value));
    }

    public static function findByIdentifier($identifier)
    {
        $applicant = self::where('username', $identifier)->first();
        if (!$applicant && is_numeric($identifier)) {
            $applicant = self::find($identifier);
            if (!$applicant) {
                $applicant = self::where('user_id', $identifier)->first();
            }
        }
        return $applicant;
    }

    public static function findByIdentifierOrFail($identifier)
    {
        $applicant = self::findByIdentifier($identifier);
        if (!$applicant) {
            throw (new \Illuminate\Database\Eloquent\ModelNotFoundException)->setModel(self::class);
        }
        return $applicant;
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function rejections(): HasMany
    {
        return $this->hasMany(ApplicantRejection::class);
    }
}
