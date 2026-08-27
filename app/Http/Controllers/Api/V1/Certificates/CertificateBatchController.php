<?php
namespace App\Http\Controllers\Api\V1\Certificates;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Certificates\CertificateTemplate;
use App\Models\Certificates\CertificateBatch;
use App\Models\Certificates\SchoolCryptoKey;
use App\Services\Certificates\CertificateGeneratorService;

class CertificateBatchController extends Controller
{
    public function generate(Request $request, CertificateGeneratorService $service)
    {
        $request->validate([
            'template_name' => 'required|string',
            'background_image' => 'required|image',
            'font_file' => 'nullable|file',
            'fields_config' => 'required|json',
            'students_data' => 'required|json',
            'whatsapp_column' => 'nullable|string'
        ]);

        $bgPath = $request->file('background_image')->store('certificates/templates', 'public');
        $fontPath = $request->hasFile('font_file') ? $request->file('font_file')->store('certificates/fonts', 'public') : null;

        $template = CertificateTemplate::create([
            'school_id' => $request->user()->school_id,
            'name' => $request->template_name,
            'background_image_path' => $bgPath,
            'font_file_path' => $fontPath,
            'fields_config' => json_decode($request->fields_config, true),
        ]);

        if (!$template->school->cryptoKey) {
            $res = openssl_pkey_new(["digest_alg" => "sha256", "private_key_bits" => 2048, "private_key_type" => OPENSSL_KEYTYPE_RSA]);
            openssl_pkey_export($res, $privKey);
            $pubKey = openssl_pkey_get_details($res)["key"];
            SchoolCryptoKey::create(['school_id' => $template->school_id, 'public_key' => $pubKey, 'private_key' => $privKey]);
        }

        $studentsData = json_decode($request->students_data, true);
        $batch = CertificateBatch::create([
            'school_id' => $template->school_id,
            'certificate_template_id' => $template->id,
            'status' => 'processing',
            'total_count' => count($studentsData)
        ]);

        foreach ($studentsData as $row) {
            $cert = $service->generate($template, $row, $request->whatsapp_column);
            $cert->update([
                'certificate_batch_id' => $batch->id,
                'file_path_pdf' => 'certificates/generated/' . $cert->uuid . '.pdf'
            ]);
        }

        $batch->update(['status' => 'completed', 'processed_count' => count($studentsData)]);
        return response()->json(['message' => 'Batch processing started', 'batch_id' => $batch->id]);
    }

    public function show($batchId)
    {
        $batch = CertificateBatch::with('certificates')->findOrFail($batchId);
        return response()->json($batch);
    }
}
