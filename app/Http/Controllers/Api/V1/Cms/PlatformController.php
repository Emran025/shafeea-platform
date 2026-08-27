<?php

namespace App\Http\Controllers\Api\V1\Cms;

use App\Http\Controllers\Controller;
use App\Models\Cms\EntityIdentity;
use App\Models\Cms\Platform;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Read-only admin views for the Platform Registry and Entity Identities.
 *
 * These objects are system-owned and cannot be created or deleted via the
 * authoring workflow (PlatformRegistry.md Rule 1, Identity.md Invariant 1).
 * Updates require platform.admin role (enforced at auth layer, not here yet).
 */
class PlatformController extends Controller
{
    // -------------------------------------------------------------------------
    // GET /api/admin/platforms
    // -------------------------------------------------------------------------

    public function index(Request $request): JsonResponse
    {
        $platforms = Platform::with('entityIdentity')
            ->when($request->get('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->get('segment'), fn ($q, $v) => $q->where('segment', $v))
            ->get()
            ->sortBy(fn (Platform $p) => $p->showcaseOrder())
            ->values();

        return response()->json($platforms);
    }

    // -------------------------------------------------------------------------
    // GET /api/admin/platforms/{id}
    // -------------------------------------------------------------------------

    public function show(string $id): JsonResponse
    {
        $platform = Platform::with('entityIdentity')->findOrFail($id);

        return response()->json($platform);
    }

    // -------------------------------------------------------------------------
    // GET /api/admin/entity-identities
    // -------------------------------------------------------------------------

    public function identities(): JsonResponse
    {
        $identities = EntityIdentity::with('platform')->get();

        return response()->json($identities);
    }
}
