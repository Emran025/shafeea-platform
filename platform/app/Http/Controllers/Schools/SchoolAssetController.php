<?php

namespace App\Http\Controllers\Schools;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class SchoolAssetController extends Controller
{
    /**
     * Resolve and serve a per-school asset (image, document, logo, media file).
     * Path pattern: shafeea.system360.cloud/school/[school_code]/assets/[file_path]
     */
    public function show(Request $request, string $school_code, string $path)
    {
        // Sanitize path to prevent directory traversal
        $path = ltrim(str_replace(['..', '\\'], ['', '/'], $path), '/');

        // Check school-specific directory first: public/schools/[school_code]/[path]
        $schoolSpecificPath = public_path("schools/{$school_code}/{$path}");
        
        if (File::exists($schoolSpecificPath) && File::isFile($schoolSpecificPath)) {
            return $this->buildFileResponse($schoolSpecificPath);
        }

        // Check storage public directory: storage/app/public/schools/[school_code]/[path]
        $storagePath = storage_path("app/public/schools/{$school_code}/{$path}");

        if (File::exists($storagePath) && File::isFile($storagePath)) {
            return $this->buildFileResponse($storagePath);
        }

        // Fallback to general schools asset directory: public/schools/[path]
        $generalPath = public_path("schools/{$path}");

        if (File::exists($generalPath) && File::isFile($generalPath)) {
            return $this->buildFileResponse($generalPath);
        }

        // Fallback placeholder logo for image requests
        if (in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'])) {
            $defaultLogoPath = public_path('schools/LogoWithText.svg');
            if (File::exists($defaultLogoPath)) {
                return $this->buildFileResponse($defaultLogoPath);
            }
        }

        abort(404, 'Asset not found');
    }

    /**
     * Build HTTP response for file with mime type and cache headers.
     */
    private function buildFileResponse(string $filePath)
    {
        $mimeType = File::mimeType($filePath) ?: 'application/octet-stream';
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        if ($extension === 'svg') {
            $mimeType = 'image/svg+xml';
        }

        return Response::file($filePath, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=86400',
            'X-School-Asset-Source' => basename($filePath),
        ]);
    }
}
