<?php

namespace App\Services\Certificates;

use App\Models\Certificates\Certificate;
use App\Models\Certificates\SchoolCryptoKey;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use setasign\Fpdi\Tcpdf\Fpdi;

class CertificateGeneratorService
{
    
    public function generate(Certificate $certificate)
    {
        $template = $certificate->batch->template;
        
        // Ensure crypto keys exist
        $cryptoKey = SchoolCryptoKey::firstOrCreate(
            ['school_id' => $certificate->school_id],
            $this->generateKeyPair()
        );

        // 1. Prepare Data Payload
        $payload = json_encode([
            'id' => $certificate->id,
            'name' => $certificate->recipient_name,
            'school_id' => $certificate->school_id,
        ]);

        // 2. Sign Payload
        $privateKey = Crypt::decryptString($cryptoKey->private_key_encrypted);
        openssl_sign($payload, $signature, $privateKey, OPENSSL_ALGO_SHA256);
        $encodedSignature = base64_encode($signature);
        
        $certificate->update(['digital_signature' => $encodedSignature]);

        $qrPath = "temp/qr_{$certificate->id}.png";
        
        try {
            // 3. Generate QR Code linking to verification page
            $verifyUrl = url("/verify/cert/{$certificate->id}");
            $qrCode = QrCode::create($verifyUrl)->setSize(150)->setMargin(0);
            $writer = new PngWriter();
            $qrResult = $writer->write($qrCode);
            Storage::disk('local')->put($qrPath, $qrResult->getString());

            // 4. Generate Image (JPG)
            $bgPath = Storage::disk('public')->path($template->background_image_path);
            $manager = new ImageManager(new Driver());
            $img = $manager->read($bgPath);
            
            // Add QR Code to bottom-left corner
            $qrImg = $manager->read(Storage::disk('local')->path($qrPath));
            $img->place($qrImg, 'bottom-left', 50, 50);

            // Draw text fields
            $fontPath = public_path('fonts/Cairo-Bold.ttf');
            $hasFont = file_exists($fontPath);
            
            foreach ($template->boxes_config as $box) {
                $text = $certificate->fields_data[$box['key']] ?? '';
                $img->text($text, $box['x'], $box['y'], function($font) use ($box, $fontPath, $hasFont) {
                    if ($hasFont) {
                        $font->file($fontPath);
                    }
                    $font->size($box['font_size']);
                    $font->color($box['color']);
                    $font->align($box['alignment']);
                    $font->valign('top');
                });
            }

            $jpgRelPath = "certificates/{$certificate->school_id}/{$certificate->id}.jpg";
            Storage::disk('public')->put($jpgRelPath, (string) $img->encodeByExtension('jpg', 90));

            // 5. Generate PDF
            $pdf = new Fpdi();
            $pdf->AddPage('L', [$img->width() * 0.264583, $img->height() * 0.264583]); // Convert px to mm roughly
            $pdf->Image(Storage::disk('public')->path($jpgRelPath), 0, 0, $img->width() * 0.264583, $img->height() * 0.264583);
            
            $pdfRelPath = "certificates/{$certificate->school_id}/{$certificate->id}.pdf";
            Storage::disk('public')->put($pdfRelPath, $pdf->Output('S'));

            // 6. Update
            $certificate->update([
                'file_path_jpg' => $jpgRelPath,
                'file_path_pdf' => $pdfRelPath,
                'status' => 'generated'
            ]);
        } finally {
            if (Storage::disk('local')->exists($qrPath)) {
                Storage::disk('local')->delete($qrPath);
            }
        }
    }

    private function generateKeyPair(): array
    {
        $config = [
            'digest_alg' => 'sha256',
            'private_key_bits' => 2048,
            'private_key_type' => OPENSSL_KEYTYPE_RSA,
        ];
        $res = openssl_pkey_new($config);
        openssl_pkey_export($res, $privateKey);
        $publicKey = openssl_pkey_get_details($res)['key'];

        return [
            'public_key' => $publicKey,
            'private_key_encrypted' => Crypt::encryptString($privateKey),
        ];
    }
}
