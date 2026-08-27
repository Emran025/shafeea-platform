<?php
namespace App\Models\Certificates;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Certificate extends Model
{
    use HasUuids;
    protected $guarded = [];
    protected $casts = ['fields_data' => 'array'];
}
