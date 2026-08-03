<?php

namespace App\Http\Controllers\Api\V1\Cms;

use App\Http\Controllers\Controller;
use App\Models\Cms\PublishBundle;
use App\Models\Cms\PublishBundleMember;
use App\Services\School\WorkflowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Publish Bundle controller — manages WR-006 atomic bundle publishing.
 *
 * Bundle lifecycle:
 *   staging → ready → published   (happy path)
 *   staging|ready → cancelled      (abort path)
 *
 * Rules enforced:
 *   WR-006  all bundle members must be in 'approved' status before publish
 *   Once published, a bundle is immutable.
 */
class PublishBundleController extends Controller
{
    public function __construct(
        private readonly WorkflowService $workflow,
    ) {}

    // -------------------------------------------------------------------------
    // POST /api/admin/bundles
    // -------------------------------------------------------------------------

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'notes' => 'nullable|string|max:2000',
        ]);

        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        $bundle = PublishBundle::create([
            'name'             => $request->name,
            'status'           => 'staging',
            'notes'            => $request->notes,
            'created_by'       => $actorId,
            'last_modified_by' => $actorId,
        ]);

        return response()->json($bundle, 201);
    }

    // -------------------------------------------------------------------------
    // GET /api/admin/bundles/{bundle}
    // -------------------------------------------------------------------------

    public function show(string $id): JsonResponse
    {
        $bundle = PublishBundle::with('members')->findOrFail($id);
        return response()->json($bundle);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/bundles/{bundle}/members
    // -------------------------------------------------------------------------

    public function addMember(Request $request, string $id): JsonResponse
    {
        $bundle = PublishBundle::findOrFail($id);

        if ($bundle->status !== 'staging') {
            return response()->json([
                'error' => "Bundle is in status '{$bundle->status}'. Members can only be added while the bundle is in 'staging'.",
            ], 422);
        }

        $request->validate([
            'object_type' => 'required|in:page,section,block,media',
            'object_id'   => 'required|string|max:50',
            'is_anchor'   => 'boolean',
        ]);

        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        $member = PublishBundleMember::create([
            'bundle_id'   => $bundle->id,
            'object_type' => $request->object_type,
            'object_id'   => $request->object_id,
            'is_anchor'   => $request->boolean('is_anchor', false),
            'added_by'    => $actorId,
        ]);

        return response()->json($member, 201);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/bundles/{bundle}/ready
    // -------------------------------------------------------------------------

    public function markReady(Request $request, string $id): JsonResponse
    {
        $bundle = PublishBundle::with('members')->findOrFail($id);

        if ($bundle->status !== 'staging') {
            return response()->json([
                'error' => "Bundle must be in 'staging' status to mark it ready. Current: '{$bundle->status}'.",
            ], 422);
        }

        if ($bundle->members->isEmpty()) {
            return response()->json([
                'error' => 'Bundle has no members. Add at least one content object before marking it ready.',
            ], 422);
        }

        $actorId           = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');
        $bundle->status           = 'ready';
        $bundle->last_modified_by = $actorId;
        $bundle->save();

        return response()->json($bundle->fresh()->load('members'));
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/bundles/{bundle}/publish
    // -------------------------------------------------------------------------

    public function publish(Request $request, string $id): JsonResponse
    {
        $bundle = PublishBundle::with('members')->findOrFail($id);

        if ($bundle->status !== 'ready') {
            return response()->json([
                'error' => "Bundle must be in 'ready' status before publishing. Current: '{$bundle->status}'.",
            ], 422);
        }

        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        try {
            // WR-006: atomic bundle publish — validates all members are approved, then publishes
            $this->workflow->publishBundle($bundle, $actorId);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        return response()->json([
            'status'       => 'published',
            'bundle_id'    => $bundle->id,
            'member_count' => $bundle->members->count(),
        ]);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/bundles/{bundle}/cancel
    // -------------------------------------------------------------------------

    public function cancel(Request $request, string $id): JsonResponse
    {
        $bundle = PublishBundle::findOrFail($id);

        if ($bundle->status === 'published') {
            return response()->json([
                'error' => 'Published bundles cannot be cancelled.',
            ], 422);
        }

        $actorId           = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');
        $bundle->status           = 'cancelled';
        $bundle->last_modified_by = $actorId;
        $bundle->save();

        return response()->json(['status' => 'cancelled', 'bundle_id' => $bundle->id]);
    }
}
