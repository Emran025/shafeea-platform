<?php
namespace App\Models\Certificates;
use Illuminate\Database\Eloquent\Model;

class CertificateBatch extends Model
{
    protected $guarded = [];
    
    public function template() { return $this->belongsTo(CertificateTemplate::class, 'certificate_template_id'); }
    public function certificates() { return $this->hasMany(Certificate::class); }
}
