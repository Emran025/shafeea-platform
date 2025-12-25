<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'subscription_id',
        'transaction_id',
        'payment_method',
        'reference_number',
        'amount',
        'status',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
        'amount' => 'decimal:2',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
