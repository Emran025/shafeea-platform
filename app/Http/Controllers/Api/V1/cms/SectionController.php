<?php

namespace App\Http\Controllers\Api\V1\cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreSectionRequest;
use App\Models\Cms\Section;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Admin authoring controller for Section objects.
 *
 * Rules enforced:
 *   SR-004  type immutability post-first-publish  — checked in update()
 *   SR-002  section belongs to exactly one page   — enforced by FK on store
 *   Deletion guard: published sections may not be deleted
 */
class SectionController extends Controller
{
    // -------------------------------------------------------------------------
    // GET /api/admin/sections
    // -------------------------------------------------------------------------

    public function index(Request $request): JsonResponse
    {
        $query = Section::with(['blocks' => fn($q) => $q->orderByPivot('position')])
            ->when($request->get('page_id'), fn($q, $v) => $q->where('page_id', $v))
            ->when($request->get('status'),  fn($q, $v) => $q->where('status', $v))
            ->when($request->get('type'),    fn($q, $v) => $q->where('type', $v))
            ->orderBy('ordering_position');

        return response()->json($query->paginate((int) $request->get('per_page', 100)));
    }

    // -------------------------------------------------------------------------
    // GET /api/admin/sections/{section}
    // -------------------------------------------------------------------------

    public function show(string $id): JsonResponse
    {
        $section = Section::with(['blocks' => fn($q) => $q->orderByPivot('position')])
            ->findOrFail($id);

        return response()->json($section);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/sections
    // -------------------------------------------------------------------------

    public function store(StoreSectionRequest $request): JsonResponse
    {
        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        $section = Section::create([
            'identity_name'    => $request->type,
            'identity_owner'   => 'editorial',
            'identity_purpose' => '',
            ...$request->validated(),
            'status'           => 'draft',
            'created_by'       => $actorId,
            'last_modified_by' => $actorId,
            'schema_version'   => 'section@1.0',
            'version_number'   => 1,
        ]);

        return response()->json($section, 201);
    }

    // -------------------------------------------------------------------------
    // PUT /api/admin/sections/{section}
    // -------------------------------------------------------------------------

    public function update(Request $request, string $id): JsonResponse
    {
        $section = Section::findOrFail($id);
        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        $request->validate([
            'background_image_url' => 'nullable|string|max:2048',
            'custom_css_classes'   => 'nullable|string|max:500',
        ]);

        // SR-004: section type is immutable after first publish
        if ($request->has('type') && $section->published_at !== null) {
            if ($request->type !== $section->type) {
                return response()->json([
                    'error' => "SR-004: Section type cannot be changed after it has been published. Current type: '{$section->type}'.",
                ], 422);
            }
        }

        // Build allowed fields — type is editable only before first publish
        $data = $request->only([
            'anchor_id',
            'position',
            'group',
            'identity_classification',
            'composition_policy',
            'visibility_rules',
            'background_image_url',
            'custom_css_classes',
        ]);

        if ($section->published_at === null && $request->has('type')) {
            $data['type'] = $request->type;
        }

        $data['last_modified_by'] = $actorId;
        $data['version_number']   = ($section->version_number ?? 1) + 1;

        $section->fill($data)->save();

        return response()->json($section->fresh());
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/sections/{section}/blocks/{block}
    // -------------------------------------------------------------------------

    public function attachBlock(Request $request, string $sectionId, string $blockId): JsonResponse
    {
        $section = Section::findOrFail($sectionId);

        $request->validate([
            'position'    => 'nullable|integer|min:0',
            'is_required' => 'boolean',
        ]);

        $section->blocks()->syncWithoutDetaching([
            $blockId => [
                'position'    => $request->get('position', 0),
                'is_required' => $request->boolean('is_required', false),
            ],
        ]);

        return response()->json(['attached' => true, 'section_id' => $sectionId, 'block_id' => $blockId]);
    }

    // -------------------------------------------------------------------------
    // DELETE /api/admin/sections/{section}/blocks/{block}
    // -------------------------------------------------------------------------

    public function detachBlock(string $sectionId, string $blockId): JsonResponse
    {
        $section = Section::findOrFail($sectionId);
        $section->blocks()->detach($blockId);

        return response()->json(['detached' => true, 'section_id' => $sectionId, 'block_id' => $blockId]);
    }

    // -------------------------------------------------------------------------
    // DELETE /api/admin/sections/{section}
    // -------------------------------------------------------------------------

    public function destroy(string $id): JsonResponse
    {
        $section = Section::findOrFail($id);

        if ($section->status === 'published') {
            return response()->json(
                ['error' => 'Cannot delete a published section. Unpublish it first.'],
                422
            );
        }

        $section->delete();

        return response()->json(null, 204);
    }
}
