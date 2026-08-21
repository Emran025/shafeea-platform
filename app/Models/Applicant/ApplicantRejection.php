<?php

namespace App\Models\Applicant;

use App\Models\School\School;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicantRejection extends Model
{
    use HasFactory, \App\Models\Traits\BelongsToSchool;

    protected $fillable = [
        'applicant_id',
        'school_id',
        'reason',
    ];

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(Applicant::class);
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
