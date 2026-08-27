<?php
namespace App\Models\Certificates;
use Illuminate\Database\Eloquent\Model;
use App\Models\School;

class CertificateBatch extends Model
{
    protected $fillable = ['school_id', 'certificate_template_id', 'status', 'total_count', 'processed_count'];
    
    public function school() { return $this->belongsTo(School::class); }
    public function template() { return $this->belongsTo(CertificateTemplate::class, 'certificate_template_id'); }
    public function certificates() { return $this->hasMany(Certificate::class); }
}
