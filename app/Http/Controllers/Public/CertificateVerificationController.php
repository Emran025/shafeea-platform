<?php
namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Certificates\Certificate;
use Inertia\Inertia;

class CertificateVerificationController extends Controller
{
    public function show($uuid)
    {
        $certificate = Certificate::with('school.cryptoKey')->where('uuid', $uuid)->first();
        
        if (!$certificate) {
            return Inertia::render('Certificates/Verify', ['valid' => false]);
        }
        
        $payload = $certificate->uuid . '|' . $certificate->recipient_name;
        $pubKey = $certificate->school->cryptoKey->public_key ?? null;
        
        $isValid = false;
        if ($pubKey && $certificate->digital_signature) {
            $isValid = openssl_verify($payload, base64_decode($certificate->digital_signature), $pubKey, OPENSSL_ALGO_SHA256) === 1;
        }

        return Inertia::render('Certificates/Verify', [
            'valid' => $isValid,
            'certificate' => $certificate->only(['uuid', 'recipient_name', 'created_at']),
            'school_name' => $certificate->school->name ?? 'Unknown'
        ]);
    }
}
