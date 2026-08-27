<?php

namespace App\Models\Halaqah;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Auth\User;

class CallSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'initiator_id',
        'target_id',
        'third_party_id',
        'status',
        'initiator_rsa_pub',
        'target_rsa_pub',
    ];

    public function initiator()
    {
        return $this->belongsTo(User::class, 'initiator_id');
    }

    public function target()
    {
        return $this->belongsTo(User::class, 'target_id');
    }

    public function thirdParty()
    {
        return $this->belongsTo(User::class, 'third_party_id');
    }
}
