<?php

namespace App\Models\Student;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory, \App\Models\Traits\BelongsToSchool;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'qualification',
        'memorization_level',
        'status',
        'username',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($student) {
            if (empty($student->username)) {
                $name = 'student';
                if ($student->user) {
                    $name = $student->user->name;
                } elseif ($student->user_id) {
                    $user = User::find($student->user_id);
                    if ($user) {
                        $name = $user->name;
                    }
                }
                $student->username = \App\Services\Auth\UsernameGenerator::generate($name);
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
        $student = self::where('username', $identifier)->first();
        if (!$student && is_numeric($identifier)) {
            $student = self::where('user_id', $identifier)->first();
        }
        return $student;
    }

    public static function findByIdentifierOrFail($identifier)
    {
        $student = self::findByIdentifier($identifier);
        if (!$student) {
            throw (new \Illuminate\Database\Eloquent\ModelNotFoundException)->setModel(self::class);
        }
        return $student;
    }

    /**
     * Get the user for the student.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the enrollments for the student.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get the reports for the student.
     */
    public function reports()
    {
        return $this->hasMany(StudentReport::class);
    }
}
