<?php

namespace App\Http\Controllers\Api\V1\Certificates;

use App\Http\Controllers\Controller;
use App\Models\Certificates\Certificate;
use Illuminate\Http\Request;

class StudentCertificateController extends Controller
{
    public function index(Request $request)
    {
        $certificates = Certificate::where('student_id', $request->user()->id)
            ->where('status', 'generated')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($cert) {
                return [
                    'id' => $cert->id,
                    'batch_name' => $cert->batch->name ?? 'شهادة',
                    'issue_date' => $cert->updated_at->format('Y-m-d'),
                    'file_url_pdf' => asset('storage/'.$cert->file_path_pdf),
                    'file_url_jpg' => asset('storage/'.$cert->file_path_jpg),
                    'verify_url' => route('certificates.verify', ['id' => $cert->id]),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $certificates,
        ]);
    }
}
