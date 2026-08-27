<?php
namespace App\Models\Certificates;
use Illuminate\Database\Eloquent\Model;
use App\Models\School;
use App\Models\Auth\User;

class Certificate extends Model
{
    protected $fillable = [
        'uuid', 'school_id', 'certificate_template_id', 'student_id',
        'recipient_name', 'recipient_phone', 'recipient_whatsapp',
        'data_payload', 'file_path_pdf', 'file_path_jpg', 'digital_signature'
    ];
    protected $casts = ['data_payload' => 'array'];

    public function school() { return $this->belongsTo(School::class); }
    public function template() { return $this->belongsTo(CertificateTemplate::class, 'certificate_template_id'); }
    public function student() { return $this->belongsTo(User::class, 'student_id'); }
}
