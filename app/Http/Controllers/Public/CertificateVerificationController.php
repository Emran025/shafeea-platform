<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Certificates\Certificate;
use App\Models\Certificates\SchoolCryptoKey;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificateVerificationController extends Controller
{
    public function verify($id)
    {
        $certificate = Certificate::find($id);

        if (!$certificate || $certificate->status !== 'generated') {
            return Inertia::render('Certificates/Verify', [
                'isValid' => false,
                'message' => 'الشهادة غير موجودة أو لم تكتمل بعد.'
            ]);
        }

        $cryptoKey = SchoolCryptoKey::where('school_id', $certificate->school_id)->first();
        
        if (!$cryptoKey || !$certificate->digital_signature) {
            return Inertia::render('Certificates/Verify', [
                'isValid' => false,
                'message' => 'بيانات التوقيع الرقمي مفقودة.'
            ]);
        }

        // Verify Signature
        $payload = json_encode([
            'id' => $certificate->id,
            'name' => $certificate->recipient_name,
            'school_id' => $certificate->school_id,
        ]);
        
        $signature = base64_decode($certificate->digital_signature);
        $isValid = openssl_verify($payload, $signature, $cryptoKey->public_key, OPENSSL_ALGO_SHA256) === 1;

        return Inertia::render('Certificates/Verify', [
            'isValid' => $isValid,
            'certificate' => [
                'id' => $certificate->id,
                'recipient_name' => $certificate->recipient_name,
                'issue_date' => $certificate->updated_at->format('Y-m-d'),
                'file_url_jpg' => asset('storage/' . $certificate->file_path_jpg),
            ]
        ]);
    }
}
