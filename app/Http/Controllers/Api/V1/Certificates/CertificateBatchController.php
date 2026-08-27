<?php

namespace App\Http\Controllers\Api\V1\Certificates;

use App\Http\Controllers\Controller;
use App\Models\Certificates\CertificateBatch;
use App\Models\Certificates\CertificateTemplate;
use App\Jobs\Certificates\GenerateCertificateJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\User;

class CertificateBatchController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'template_name' => 'required|string|max:255',
            'background_image' => 'required|string', // base64
            'font_family' => 'nullable|string',
            'boxes' => 'required|array',
            'students' => 'required|array',
        ]);

        $schoolId = $request->user()->school_id ?? 1; // Assuming school context

        // Save Template Image
        $imgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $validated['background_image']));
        $bgPath = "templates/{$schoolId}/" . Str::random(10) . ".jpg";
        Storage::disk('public')->put($bgPath, $imgData);

        // Create Template
        $template = CertificateTemplate::create([
            'school_id' => $schoolId,
            'name' => $validated['template_name'],
            'background_image_path' => $bgPath,
            'font_family' => $validated['font_family'] ?? 'cairo',
            'boxes_config' => $validated['boxes'],
        ]);

        // Create Batch
        $batch = CertificateBatch::create([
            'school_id' => $schoolId,
            'certificate_template_id' => $template->id,
            'name' => "دفعة " . now()->format('Y-m-d H:i'),
            'total_count' => count($validated['students']),
            'status' => 'processing',
        ]);

        
        // Create Certificates and Dispatch Jobs
        foreach ($validated['students'] as $studentData) {
            $phone = $studentData['recipient_whatsapp'] ?? $studentData['phone'] ?? null;
            $studentId = null;
            if ($phone) {
                $user = User::where('phone', $phone)->orWhere('whatsapp_number', $phone)->first();
                if ($user) {
                    $studentId = $user->id;
                }
            }

            $cert = $batch->certificates()->create([
                'school_id' => $schoolId,
                'student_id' => $studentId,
                'recipient_name' => $studentData['recipient_name'] ?? 'بدون اسم',
                'recipient_whatsapp' => $phone,
                'fields_data' => $studentData,
                'status' => 'pending',
            ]);

            GenerateCertificateJob::dispatch($cert);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'batch_id' => $batch->id,
                'status' => 'processing',
                'message' => 'تم استلام الدفعة وجاري التوليد في الخلفية.'
            ]
        ]);
    }

    public function show(Request $request, $id)
    {
        $schoolId = $request->user()->school_id ?? 1;
        $batch = CertificateBatch::where('school_id', $schoolId)->with('certificates')->findOrFail($id);
        
        $certificates = $batch->certificates->map(function ($cert) {
            return [
                'id' => $cert->id,
                'recipient_name' => $cert->recipient_name,
                'recipient_whatsapp' => $cert->recipient_whatsapp,
                'status' => $cert->status,
                'file_url_pdf' => $cert->file_path_pdf ? asset('storage/' . $cert->file_path_pdf) : null,
                'file_url_jpg' => $cert->file_path_jpg ? asset('storage/' . $cert->file_path_jpg) : null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'batch' => $batch->only(['id', 'name', 'status', 'total_count', 'processed_count']),
                'certificates' => $certificates
            ]
        ]);
    }
}
