<?php

namespace App\Http\Controllers\Api\V1\Cms;

use App\Http\Controllers\Controller;
use App\Models\Cms\Block;
use App\Models\Cms\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Admin controller for Media objects.
 *
 * Media follows a two-phase lifecycle:
 *   1. store()    — registers the metadata record in status 'processing'
 *   2. setReady() — called after the binary upload is confirmed → status 'ready'
 *
 * upload() is a single-step convenience method: it accepts a file, stores it
 * to public/uploads/media/, creates the record with status 'ready', and returns
 * both the record and the public URL.
 *
 * Media in status 'ready' may be referenced by blocks.
 * Media referenced by active blocks may not be deleted.
 */
class MediaController extends Controller
{
    // -------------------------------------------------------------------------
    // GET /api/admin/media
    // -------------------------------------------------------------------------

    public function index(Request $request): JsonResponse
    {
        $query = Media::query()
            ->when($request->get('status'),     fn($q, $v) => $q->where('status', $v))
            ->when($request->get('type'),       fn($q, $v) => $q->where('type', $v))
            ->where('site_scope', $request->route('school_code') ?? $request->get('site_scope'))
            ->orderBy('created_at', 'desc');

        return response()->json($query->paginate((int) $request->get('per_page', 50)));
    }

    // -------------------------------------------------------------------------
    // GET /api/admin/media/{media}
    // -------------------------------------------------------------------------

    public function show(string $id): JsonResponse
    {
        return response()->json(Media::findOrFail($id));
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/media/upload  (single-step file upload)
    // -------------------------------------------------------------------------

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file'     => 'required|file|mimes:jpeg,jpg,png,gif,webp,svg,avif|max:20480',
            'alt_text' => 'nullable|string|max:500',
            'name'     => 'nullable|string|max:255',
        ]);

        $file    = $request->file('file');
        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');
        $ext     = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $uid     = substr(str_replace('-', '', (string) Str::uuid()), 0, 14);
        $filename = 'media_' . $uid . '.' . $ext;
        $dir      = public_path('uploads/media');

        // Capture these before move() deletes the temp file
        $mime        = $file->getMimeType() ?: 'image/jpeg';
        $clientName  = $file->getClientOriginalName();
        $inputName   = $request->input('name') ?: pathinfo($clientName, PATHINFO_FILENAME);

        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $file->move($dir, $filename);
        $fullPath = $dir . DIRECTORY_SEPARATOR . $filename;

        // Attempt to read image dimensions
        $width  = null;
        $height = null;
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true)) {
            $size   = @getimagesize($fullPath);
            $width  = $size[0] ?? null;
            $height = $size[1] ?? null;
        }

        // Use a root-relative path so images work on any hostname/proxy
        $relativePath = '/uploads/media/' . $filename;
        $altText      = $request->input('alt_text');
        $name         = $inputName;
        $imgType      = str_starts_with($mime, 'image/svg') ? 'image.graphic' : 'image.photo';

        $media = Media::create([
            'type'                       => $imgType,
            'status'                     => 'ready',
            'identity_name'              => $name,
            'identity_original_filename' => $clientName,
            'identity_owner'             => 'upload',
            'identity_tags'              => [],
            'source_store_type'          => 'external_url',
            'source_external_url'        => $relativePath,
            'source_mime_type'           => $mime,
            'source_size_bytes'          => file_exists($fullPath) ? filesize($fullPath) : null,
            'dimensions_width'           => $width,
            'dimensions_height'          => $height,
            'delivery_base_url'          => $relativePath,
            'delivery_variants'          => [['label' => 'original', 'url' => $relativePath]],
            'locale_meta'                => $altText ? ['en' => ['alt_text' => $altText]] : [],
            'created_by'                 => $actorId,
            'last_modified_by'           => $actorId,
            'site_scope'                 => $request->route('school_code') ?? $request->get('site_scope'),
        ]);

        return response()->json([
            'media' => $media,
            'url'   => $relativePath,
        ], 201);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/media
    // -------------------------------------------------------------------------

    public function store(Request $request): JsonResponse
    {
        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        $request->validate([
            'type'                       => 'required|in:image.photo,image.graphic,image.icon,image.logo,video.hosted,video.native,document.pdf,document.report',
            'identity_name'              => 'required|string|max:500',
            'identity_original_filename' => 'required|string|max:500',
            'identity_owner'             => 'required|string|max:255',
            'source_store_type'          => 'required|in:s3_compatible,external_url',
            'source_mime_type'           => 'required|string|max:200',
            'source_bucket'              => 'nullable|string|max:255',
            'source_object_key'          => 'nullable|string|max:1000',
            'source_external_url'        => 'nullable|string|max:2000',
            'delivery_base_url'          => 'required|string|max:2000',
            'locale_meta'                => 'nullable|array',
        ]);

        $media = Media::create([
            ...$request->only([
                'type',
                'identity_name',
                'identity_original_filename',
                'identity_owner',
                'identity_description',
                'identity_tags',
                'source_store_type',
                'source_bucket',
                'source_object_key',
                'source_external_url',
                'source_mime_type',
                'source_size_bytes',
                'source_checksum_sha256',
                'dimensions_width',
                'dimensions_height',
                'delivery_base_url',
                'delivery_variants',
                'delivery_is_public',
                'locale_meta',
            ]),
            'status'           => 'processing',
            'site_scope'       => $request->route('school_code') ?? $request->get('site_scope'),
            'created_by'       => $actorId,
            'last_modified_by' => $actorId,
        ]);

        return response()->json($media, 201);
    }

    // -------------------------------------------------------------------------
    // PUT /api/admin/media/{media}
    // -------------------------------------------------------------------------

    public function update(Request $request, string $id): JsonResponse
    {
        $media   = Media::findOrFail($id);
        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        $request->validate([
            'identity_name'  => 'sometimes|string|max:500',
            'locale_meta'    => 'sometimes|array',
            'identity_tags'  => 'sometimes|array',
            'delivery_is_public' => 'sometimes|boolean',
        ]);

        $media->fill([
            ...$request->only(['identity_name', 'locale_meta', 'identity_tags', 'delivery_is_public']),
            'last_modified_by' => $actorId,
        ])->save();

        return response()->json($media->fresh());
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/media/{media}/ready
    // -------------------------------------------------------------------------

    public function setReady(Request $request, string $id): JsonResponse
    {
        $media = Media::findOrFail($id);

        if (! in_array($media->status, ['processing', 'uploading'], true)) {
            return response()->json([
                'error' => "Media is in status '{$media->status}'. Only 'processing' or 'uploading' media can be set to 'ready'.",
            ], 422);
        }

        $media->status = 'ready';
        $media->save();

        return response()->json($media->fresh());
    }

    // -------------------------------------------------------------------------
    // DELETE /api/admin/media/{media}
    // -------------------------------------------------------------------------

    public function destroy(string $id): JsonResponse
    {
        $media = Media::findOrFail($id);

        $inUse = Block::where('media_id', $id)->exists();
        if ($inUse) {
            return response()->json([
                'error' => 'This media object is referenced by one or more blocks. Remove all block references before deleting.',
            ], 422);
        }

        $media->delete();

        return response()->json(null, 204);
    }
}
