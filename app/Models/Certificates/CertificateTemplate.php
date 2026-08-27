<?php
namespace App\Models\Certificates;
use Illuminate\Database\Eloquent\Model;
use App\Models\School;

class CertificateTemplate extends Model
{
    protected $fillable = ['school_id', 'name', 'background_image_path', 'font_file_path', 'fields_config'];
    protected $casts = ['fields_config' => 'array'];

    public function school() { return $this->belongsTo(School::class); }
    public function certificates() { return $this->hasMany(Certificate::class); }
}
