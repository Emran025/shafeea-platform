<?php

namespace App\Http\Controllers\Api\V1\cms;

use App\Http\Controllers\Controller;
use App\Models\Cms\Block;
use App\Models\Cms\Section;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Atomic Section + Block composition controller.
 *
 * Unlike the granular SectionController / BlockController pair, this
 * controller accepts a single payload that describes both the section
 * metadata AND its full block list. It creates (or replaces) everything
 * in one database transaction, which is the natural UX for the admin
 * section-composer form.
 *
 * POST /api/admin/sections/compose   — create section + blocks
 * PUT  /api/admin/sections/{id}/compose — replace blocks on existing section
 */
class SectionComposeController extends Controller
{
    private const VALID_TYPES = [
        // Original set
        'hero',
        'narrative',
        'value_proposition',
        'platform_showcase',
        'leadership',
        'statistics',
        'testimonial',
        'cta_band',
        'legal_body',
        'contact_form',
        'navigation_anchor',
        'freeform',
        // Phase 1 — platform full-page types
        'problem_statement',
        'solution_overview',
        'capability_grid',
        'ecosystem_diagram',
        'use_case_grid',
        'industry_grid',
        'pricing_card_row',
        'breadcrumb',
        'in_page_nav',
        'customer_story_grid',
        'blog_post_grid',
        'pricing_table',
        // Phase 2 — media-rich
        'media_spotlight',
        'media_banner',
        'video_feature',
        'media_grid',
        // Gaps & Enterprise Extensions
        'logo_cloud',
        'faq_accordion',
        'tabbed_switcher',
        'resource_gate',
        'product_comparison',
        // Article / newsroom body
        'prose_body',
        'rich_text',
    ];

    // -------------------------------------------------------------------------
    // POST /api/admin/sections/compose
    // -------------------------------------------------------------------------

    public function store(Request $request): JsonResponse
    {
        $typeList = implode(',', self::VALID_TYPES);

        $request->validate([
            'page_id'           => 'required|uuid|exists:pages,id',
            'type'              => "required|string|in:{$typeList}",
            'identity_name'     => 'nullable|string|max:200',
            'ordering_position' => 'nullable|integer|min:0',
            'blocks'            => 'required|array|min:1',
            'blocks.*.type'     => 'required|string|max:100',
            'blocks.*.fields'   => 'required|array',
        ]);

        $actorId  = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');
        $position = $request->integer(
            'ordering_position',
            Section::where('page_id', $request->page_id)->count()
        );

        $section = Section::create([
            'page_id'           => $request->page_id,
            'type'              => $request->type,
            'identity_name'     => $request->get('identity_name', $request->type),
            'identity_owner'    => 'editorial',
            'identity_purpose'  => 'composed section',
            'ordering_position' => $position,
            'ordering_group'    => 'below-fold',
            'status'            => 'draft',
            'created_by'        => $actorId,
            'last_modified_by'  => $actorId,
            'schema_version'    => 'section@1.0',
            'version_number'    => 1,
        ]);

        $this->attachBlocks($section, $request->blocks, $actorId);

        return response()->json($this->fresh($section->id), 201);
    }

    // -------------------------------------------------------------------------
    // PUT /api/admin/sections/{section}/compose
    // -------------------------------------------------------------------------

    public function update(Request $request, string $id): JsonResponse
    {
        $section = Section::with('blocks')->findOrFail($id);

        if ($section->status === 'published') {
            return response()->json([
                'error' => 'Cannot edit a published section. Unpublish it first.',
            ], 422);
        }

        $request->validate([
            'identity_name'     => 'nullable|string|max:200',
            'ordering_position' => 'nullable|integer|min:0',
            'blocks'            => 'required|array|min:1',
            'blocks.*.type'     => 'required|string|max:100',
            'blocks.*.fields'   => 'required|array',
        ]);

        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        // Update section metadata
        $meta = [
            'status'           => 'draft',
            'last_modified_by' => $actorId,
            'version_number'   => ($section->version_number ?? 1) + 1,
        ];
        if ($request->has('identity_name'))     $meta['identity_name']     = $request->identity_name;
        if ($request->has('ordering_position')) $meta['ordering_position'] = $request->ordering_position;
        $section->fill($meta)->save();

        // Detach all blocks and delete draft blocks currently linked to this section
        $allBlockIds = $section->blocks->pluck('id')->toArray();
        $draftIds = $section->blocks()
            ->where('status', 'draft')
            ->pluck('blocks.id')
            ->toArray();

        $section->blocks()->detach($allBlockIds);
        Block::whereIn('id', $draftIds)->where('status', 'draft')->delete();

        // Attach new blocks
        $this->attachBlocks($section, $request->blocks, $actorId);

        return response()->json($this->fresh($id));
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private function attachBlocks(Section $section, array $blocksData, string $actorId): void
    {
        foreach ($blocksData as $idx => $blockData) {
            $block = Block::create([
                'type'           => $blockData['type'],
                'locale_content' => [
                    'en' => [
                        'locale'      => 'en',
                        'is_complete' => true,
                        'fields'      => $blockData['fields'],
                    ],
                ],
                'status'           => 'draft',
                'created_by'       => $actorId,
                'last_modified_by' => $actorId,
                'schema_version'   => 'block@1.0',
                'version_number'   => 1,
            ]);

            $section->blocks()->syncWithoutDetaching([
                $block->id => ['position' => $idx + 1, 'is_required' => false],
            ]);
        }
    }

    private function fresh(string $id): Section
    {
        return Section::with(['blocks' => fn($q) => $q->orderByPivot('position')])->find($id);
    }
}
