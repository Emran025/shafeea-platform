<?php

namespace App\Http\Controllers\Api\V1\cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreBlockRequest;
use App\Http\Requests\Cms\UpdateBlockRequest;
use App\Models\Cms\Block;
use App\Services\School\WorkflowService;
use Illuminate\Http\JsonResponse;

/**
 * Admin authoring controller for Block objects.
 *
 * Rules enforced:
 *   SR-005  type immutability    — UpdateBlockRequest + BlockObserver
 *   WR-005  published block edit → creates draft version instead of mutating
 *   Deletion guard: published blocks may not be deleted
 */
class BlockController extends Controller
{
    public function __construct(
        private readonly WorkflowService $workflow,
    ) {}

    // -------------------------------------------------------------------------
    // GET /api/admin/blocks/{block}
    // -------------------------------------------------------------------------

    public function show(string $id): JsonResponse
    {
        $block = Block::with('media')->findOrFail($id);
        return response()->json($block);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/blocks
    // -------------------------------------------------------------------------

    public function store(StoreBlockRequest $request): JsonResponse
    {
        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        $block = Block::create([
            ...$request->validated(),
            'status'           => 'draft',
            'created_by'       => $actorId,
            'last_modified_by' => $actorId,
            'schema_version'   => 'block@1.0',
            'version_number'   => 1,
        ]);

        return response()->json($block, 201);
    }

    // -------------------------------------------------------------------------
    // PUT /api/admin/blocks/{block}
    // -------------------------------------------------------------------------

    public function update(UpdateBlockRequest $request, string $id): JsonResponse
    {
        $block   = Block::findOrFail($id);
        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        // WR-005: editing a published block creates a new draft version.
        // The published block stays live; the draft version completes its own publish cycle.
        if ($block->status === 'published') {
            $draftBlock = $this->workflow->createDraftVersion($block, $actorId);

            // Apply the requested field updates to the new draft
            $draftBlock->fill([
                ...$request->validated(),
                'last_modified_by' => $actorId,
            ])->save();

            return response()->json([
                'message'           => 'WR-005: Published blocks are immutable. A new draft version has been created with your changes.',
                'original_block_id' => $block->id,
                'draft_block_id'    => $draftBlock->id,
                'draft_block'       => $draftBlock->fresh(),
            ], 201);
        }

        $block->fill([
            ...$request->validated(),
            'last_modified_by' => $actorId,
            'version_number'   => ($block->version_number ?? 1) + 1,
        ])->save();

        return response()->json($block->fresh());
    }

    // -------------------------------------------------------------------------
    // DELETE /api/admin/blocks/{block}
    // -------------------------------------------------------------------------

    public function destroy(string $id): JsonResponse
    {
        $block = Block::findOrFail($id);

        if ($block->status === 'published') {
            return response()->json(
                ['error' => 'Cannot delete a published block. Archive it first via the workflow endpoint.'],
                422
            );
        }

        $block->delete();

        return response()->json(null, 204);
    }
}
