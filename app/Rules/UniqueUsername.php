<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class UniqueUsername implements ValidationRule
{
    protected $ignoreUserId;

    /**
     * Create a new rule instance.
     */
    public function __construct($ignoreUserId = null)
    {
        $this->ignoreUserId = $ignoreUserId;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Never rely on database collation for case-insensitive matching —
        // always compare against the normalized (lowercase) form, since
        // that is what every write path now stores.
        $value = mb_strtolower(trim($value));

        $existsInStudents = DB::table('students')
            ->where('username', $value)
            ->when($this->ignoreUserId, function ($query) {
                $query->where('user_id', '!=', $this->ignoreUserId);
            })
            ->exists();

        $existsInTeachers = DB::table('teachers')
            ->where('username', $value)
            ->when($this->ignoreUserId, function ($query) {
                $query->where('user_id', '!=', $this->ignoreUserId);
            })
            ->exists();

        $existsInApplicants = DB::table('applicants')
            ->where('username', $value)
            ->when($this->ignoreUserId, function ($query) {
                $query->where('user_id', '!=', $this->ignoreUserId);
            })
            ->exists();

        if ($existsInStudents || $existsInTeachers || $existsInApplicants) {
            $fail('The :attribute has already been taken.');
        }
    }
}
