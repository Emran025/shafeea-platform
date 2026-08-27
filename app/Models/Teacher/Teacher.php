<?php

namespace App\Models\Teacher;

use App\Models\Auth\User;
use App\Models\Halaqah\Halaqah;
use App\Models\Halaqah\HalaqahTeacher;
use App\Models\Scopes\GenderScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use \App\Models\Traits\BelongsToSchool, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'bio',
        'experience_years',
        'username',
    ];

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new GenderScope);

        static::creating(function ($teacher) {
            if (empty($teacher->username)) {
                $name = 'teacher';
                if ($teacher->user) {
                    $name = $teacher->user->name;
                } elseif ($teacher->user_id) {
                    $user = \App\Models\Auth\User::find($teacher->user_id);
                    if ($user) {
                        $name = $user->name;
                    }
                }
                $teacher->username = \App\Services\Auth\UsernameGenerator::generate($name);
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
        $teacher = self::where('username', $identifier)->first();
        if (! $teacher && is_numeric($identifier)) {
            $teacher = self::where('user_id', $identifier)->first();
        }

        return $teacher;
    }

    public static function findByIdentifierOrFail($identifier)
    {
        $teacher = self::findByIdentifier($identifier);
        if (! $teacher) {
            throw (new \Illuminate\Database\Eloquent\ModelNotFoundException)->setModel(self::class);
        }

        return $teacher;
    }

    /**
     * Get the user for the teacher.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The halaqahs that belong to the teacher.
     */
    public function halaqahs()
    {
        return $this->belongsToMany(Halaqah::class, 'halaqah_teacher')
            ->using(HalaqahTeacher::class)
            ->withPivot('assigned_at', 'note', 'is_current');
    }

    /**
     * Get the teacher's calculated status.
     */
    public function getCalculatedStatusAttribute(): int
    {
        $isActive = $this->halaqahs()
            ->where('is_active', true)
            ->wherePivot('is_current', true)
            ->exists();

        return $isActive ? 1 : 2;
    }
}
