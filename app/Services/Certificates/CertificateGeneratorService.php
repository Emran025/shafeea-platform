<?php
namespace App\Services\Certificates;

use App\Models\Certificates\Certificate;
use App\Models\Certificates\CertificateTemplate;
use Illuminate\Support\Str;

class CertificateGeneratorService
{
    /**
     * Generates a certificate record and applies digital signature.
     * Actual image/PDF generation should be handled by a queue job using Intervention Image / TCPDF.
     */
    public function generate(CertificateTemplate $template, array $dataRow, string $whatsappColumn = null)
    {
        $uuid = Str::uuid()->toString();
        $recipientName = $dataRow['name'] ?? 'Unknown';
        
        // Retrieve school crypto key
        $cryptoKey = $template->school->cryptoKey;
        $signature = null;
        if ($cryptoKey) {
            // Sign the UUID and recipient name
            $payload = $uuid . '|' . $recipientName;
            openssl_sign($payload, $signature, $cryptoKey->private_key, OPENSSL_ALGO_SHA256);
            $signature = base64_encode($signature);
        }

        return Certificate::create([
            'uuid' => $uuid,
            'school_id' => $template->school_id,
            'certificate_template_id' => $template->id,
            'recipient_name' => $recipientName,
            'recipient_whatsapp' => $whatsappColumn ? ($dataRow[$whatsappColumn] ?? null) : null,
            'data_payload' => $dataRow,
            'digital_signature' => $signature,
        ]);
    }
}
