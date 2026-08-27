<?php
namespace App\Models\Certificates;
use Illuminate\Database\Eloquent\Model;
use App\Models\School;

class SchoolCryptoKey extends Model
{
    protected $fillable = ['school_id', 'public_key', 'private_key'];
    public function school() { return $this->belongsTo(School::class); }
}
