<?php

namespace App\Models\Tracking;

use App\Models\Subscription\Plan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FrequencyType extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'days_between',
        'description',
    ];

    /**
     * Get the plans for the frequency type.
     */
    public function plans()
    {
        return $this->hasMany(Plan::class);
    }
}
