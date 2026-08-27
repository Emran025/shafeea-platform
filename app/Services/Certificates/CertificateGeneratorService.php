<?php

namespace App\Services\Certificates;

use App\Models\Certificates\Certificate;
use App\Models\Certificates\SchoolCryptoKey;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Intervention\Image\ImageManagerStatic as Image;
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

        // 3. Generate QR Code linking to verification page
        $verifyUrl = url("/verify/cert/{$certificate->id}");
        $qrCode = QrCode::create($verifyUrl)->setSize(150)->setMargin(0);
        $writer = new PngWriter();
        $qrResult = $writer->write($qrCode);
        $qrPath = "temp/qr_{$certificate->id}.png";
        Storage::disk('local')->put($qrPath, $qrResult->getString());

        // 4. Generate Image (JPG)
        $bgPath = Storage::disk('public')->path($template->background_image_path);
        $img = Image::make($bgPath);
        
        // Add QR Code to bottom-left corner
        $img->insert(Storage::disk('local')->path($qrPath), 'bottom-left', 50, 50);

        // Draw text fields
        foreach ($template->boxes_config as $box) {
            $text = $certificate->fields_data[$box['key']] ?? '';
            $img->text($text, $box['x'], $box['y'], function($font) use ($box, $template) {
                // In production, load TTF font file based on $template->font_family
                $font->file(public_path('fonts/Cairo-Bold.ttf'));
                $font->size($box['font_size']);
                $font->color($box['color']);
                $font->align($box['alignment']);
                $font->valign('top');
            });
        }

        $jpgRelPath = "certificates/{$certificate->school_id}/{$certificate->id}.jpg";
        Storage::disk('public')->put($jpgRelPath, (string) $img->encode('jpg', 90));

        // 5. Generate PDF
        $pdf = new Fpdi();
        $pdf->AddPage('L', [$img->width() * 0.264583, $img->height() * 0.264583]); // Convert px to mm roughly
        $pdf->Image(Storage::disk('public')->path($jpgRelPath), 0, 0, $img->width() * 0.264583, $img->height() * 0.264583);
        
        $pdfRelPath = "certificates/{$certificate->school_id}/{$certificate->id}.pdf";
        Storage::disk('public')->put($pdfRelPath, $pdf->Output('S'));

        // 6. Cleanup & Update
        Storage::disk('local')->delete($qrPath);
        $certificate->update([
            'file_path_jpg' => $jpgRelPath,
            'file_path_pdf' => $pdfRelPath,
            'status' => 'generated'
        ]);
    }

    private function generateKeyPair(): array
    {
        $config = [
            "digest_alg" => "sha256",
            "private_key_bits" => 2048,
            "private_key_type" => OPENSSL_KEYTYPE_RSA,
        ];
        $res = openssl_pkey_new($config);
        openssl_pkey_export($res, $privateKey);
        $publicKey = openssl_pkey_get_details($res)["key"];

        return [
            'public_key' => $publicKey,
            'private_key_encrypted' => Crypt::encryptString($privateKey),
        ];
    }
}
