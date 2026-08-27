<?php

namespace App\Http\Controllers\Api\V1\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StorePageRequest;
use App\Http\Requests\Cms\UpdatePageRequest;
use App\Models\Cms\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Admin authoring controller for Page objects.
 *
 * Rules enforced:
 *   SR-001  slug uniqueness    — via StorePageRequest + PageObserver
 *   SR-006  hierarchy depth    — parent_id validation
 *   WR-001  single index page  — via StorePageRequest + PageObserver
 *   Deletion guard             — published pages may not be deleted
 *
 * Actor identity: X-Actor-ID header (will be Auth::id() once Sanctum is wired).
 */
class PageController extends Controller
{
    // -------------------------------------------------------------------------
    // GET /api/admin/pages
    // -------------------------------------------------------------------------

    public function index(Request $request): JsonResponse
    {
        $query = Page::query()
            ->when($request->get('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->get('type'), fn ($q, $v) => $q->where('type', $v))
            ->when($request->get('not_type'), fn ($q, $v) => $q->where('type', '!=', $v))
            ->where('site_scope', $request->route('school_code') ?? $request->get('site_scope'))
            ->when($request->get('parent_id'), fn ($q, $v) => $q->where('parent_id', $v))
            ->when($request->get('slug'), fn ($q, $v) => $q->where('slug', $v))
            ->orderBy('hierarchy_depth')
            ->orderBy('hierarchy_position');

        return response()->json($query->paginate((int) $request->get('per_page', 50)));
    }

    // -------------------------------------------------------------------------
    // GET /api/admin/pages/{page}
    // -------------------------------------------------------------------------

    public function show(string $id): JsonResponse
    {
        $page = Page::with(['sections' => fn ($q) => $q->orderBy('ordering_position')])->find($id);

        if (! $page) {
            return response()->json(['error' => 'Page not found.'], 404);
        }

        return response()->json($page);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/pages
    // -------------------------------------------------------------------------

    public function store(StorePageRequest $request): JsonResponse
    {
        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        $page = Page::create([
            'identity_title' => ['en' => 'Untitled Page'],
            'identity_purpose' => ['en' => ''],
            'identity_owner' => 'editorial',
            'identity_canonical_url' => 'https://accsystemerp.com/'.($request->slug ?? ''),
            'meta_seo_title' => ['en' => ''],
            'meta_seo_description' => ['en' => ''],
            ...$request->validated(),
            'status' => 'draft',
            'created_by' => $actorId,
            'last_modified_by' => $actorId,
            'schema_version' => 'page@1.0',
            'version_number' => 1,
        ]);

        return response()->json($page, 201);
    }

    // -------------------------------------------------------------------------
    // PUT /api/admin/pages/{page}
    // -------------------------------------------------------------------------

    public function update(UpdatePageRequest $request, string $id): JsonResponse
    {
        $page = Page::findOrFail($id);
        $actorId = $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');

        $page->fill([
            ...$request->validated(),
            'last_modified_by' => $actorId,
            'version_number' => ($page->version_number ?? 1) + 1,
        ])->save();

        return response()->json($page->fresh());
    }

    // -------------------------------------------------------------------------
    // DELETE /api/admin/pages/{page}
    // -------------------------------------------------------------------------

    public function destroy(string $id): JsonResponse
    {
        $page = Page::findOrFail($id);

        if ($page->status === 'published') {
            return response()->json(
                ['error' => 'Cannot delete a published page. Unpublish it first.'],
                422
            );
        }

        // Guard: page has published child pages
        $hasPublishedChildren = Page::where('parent_id', $page->id)
            ->where('status', 'published')
            ->exists();

        if ($hasPublishedChildren) {
            return response()->json(
                ['error' => 'Cannot delete a page that has published child pages.'],
                422
            );
        }

        $page->delete();

        return response()->json(null, 204);
    }
}
