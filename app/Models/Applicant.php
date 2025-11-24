<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Applicant extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'school_id',
        'application_type',
        'status',
        'bio',
        'qualifications',
        'intent_statement',
        'memorization_level',
        'submitted_at',
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
