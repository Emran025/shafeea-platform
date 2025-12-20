<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrivacyPolicy extends Model
{
    use HasFactory;

    protected $table = 'privacy_policy';

    protected $primaryKey = 'version';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'version',
        'last_updated',
        'summary_json',
        'sections_json',
        'changelog',
        'required_consent',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'last_updated' => 'datetime',
            'summary_json' => 'array',
            'sections_json' => 'array',
            'required_consent' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
