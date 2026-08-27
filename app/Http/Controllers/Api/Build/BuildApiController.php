<?php

namespace App\Http\Controllers\Api\Build;

use App\Http\Controllers\Controller;
use App\Models\School\School;
use App\Services\Build\BuildApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * BuildApiController
 *
 * Provides the secure API consumed exclusively by GitHub Actions during the
 * CI/CD white-label build pipeline.
 *
 * ALL routes in this controller are protected by the VerifyBuildApiSignature
 * middleware — requests without a valid RSA-SHA256 signature are rejected with 401.
 *
 * ── Endpoints ────────────────────────────────────────────────────────────────
 *
 *   GET  /api/build/schools
 *        List schools to build.
 *        Query params:
 *          ?mode=new_release            → return ALL active schools
 *          ?mode=latest_release&release=v2.0.0 → return only schools not yet
 *                                                 built for v2.0.0
 *
 *   GET  /api/build/schools/{id}
 *        Return the full build configuration for a single school.
 *
 *   POST /api/build/schools/{id}/mark-built
 *        Mark a school as successfully built for a release.
 *        Body: { "release": "v2.0.0" }
 *
 *   POST /api/build/schools/{id}/mark-building
 *        Mark a school build as in-progress (called at the start of a CI job).
 *
 *   POST /api/build/schools/{id}/mark-failed
 *        Mark a school build as failed.
 */
class BuildApiController extends Controller
{
    public function __construct(private BuildApiService $buildService) {}

    /**
     * GET /api/build/schools
     *
     * Returns the list of schools that require a build, with their full
     * configuration payloads.
     */
    public function index(Request $request): JsonResponse
    {
        $mode = $request->query('mode', 'latest_release');
        $release = $request->query('release');

        $schools = $this->buildService->getSchoolsForBuild($mode, $release);

        $payload = $schools->map(fn (School $school) => $this->buildService->generateBuildPayload($school));

        return response()->json([
            'success' => true,
            'mode' => $mode,
            'release' => $release,
            'count' => $payload->count(),
            'data' => $payload->values(),
        ]);
    }

    /**
     * GET /api/build/schools/{school}
     *
     * Returns the full build configuration for a single school.
     */
    public function show(School $school): JsonResponse
    {
        if (! $school->is_active) {
            return response()->json([
                'success' => false,
                'message' => "School [{$school->school_code}] is not active and cannot be built.",
            ], 422);
        }

        return response()->json([
            'success' => true,
            'school' => $this->buildService->generateBuildPayload($school),
        ]);
    }

    /**
     * POST /api/build/schools/{school}/mark-built
     *
     * Called by GitHub Actions after a successful APK upload to mark
     * the school as built for the given release.
     *
     * Body: { "release": "v2.0.0" }
     */
    public function markBuilt(Request $request, School $school): JsonResponse
    {
        $request->validate([
            'release' => 'required|string|max:30',
        ]);

        $this->buildService->markSchoolBuilt($school, $request->input('release'));

        return response()->json([
            'success' => true,
            'message' => "School [{$school->school_code}] marked as built for release {$request->input('release')}.",
        ]);
    }

    /**
     * POST /api/build/schools/{school}/mark-building
     *
     * Called when the CI job starts, so the dashboard shows "building" status.
     */
    public function markBuilding(School $school): JsonResponse
    {
        $this->buildService->markSchoolBuilding($school);

        return response()->json([
            'success' => true,
            'message' => "School [{$school->school_code}] marked as building.",
        ]);
    }

    /**
     * POST /api/build/schools/{school}/mark-failed
     *
     * Called when the CI job fails, so the dashboard can surface the failure.
     */
    public function markFailed(School $school): JsonResponse
    {
        $this->buildService->markSchoolFailed($school);

        return response()->json([
            'success' => true,
            'message' => "School [{$school->school_code}] marked as failed.",
        ]);
    }
}
