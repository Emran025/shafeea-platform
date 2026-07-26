<?php

namespace App\Http\Controllers\Api\V1\cms;

use App\Http\Controllers\Controller;
use App\Models\Cms\Block;
use App\Models\Cms\Media;
use App\Models\Cms\Page;
use App\Models\Cms\Section;
use App\Models\Cms\StatusTransition;
use App\Services\School\WorkflowService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Workflow transition controller — drives the authoring and publishing state machines.
 *
 * Endpoints:
 *   POST /api/admin/workflow/{type}/{id}/submit          draft → in_review
 *   POST /api/admin/workflow/{type}/{id}/request-changes in_review → draft
 *   POST /api/admin/workflow/{type}/{id}/approve         in_review → approved  (WR-002)
 *   POST /api/admin/workflow/{type}/{id}/publish         approved → published  (runs gate)
 *   POST /api/admin/workflow/{type}/{id}/schedule        approved → scheduled
 *   POST /api/admin/workflow/{type}/{id}/unpublish       published → archived|draft|hidden
 *
 * {type} is one of: page | section | block | media
 *
 * All transitions are recorded in status_transitions (append-only audit trail).
 * Publish events are recorded in publish_events.
 */
class WorkflowController extends Controller
{
    public function __construct(
        private readonly WorkflowService $workflow,
    ) {}

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private function resolveEntity(string $type, string $id): ?Model
    {
        return match ($type) {
            'page'    => Page::find($id),
            'section' => Section::find($id),
            'block'   => Block::find($id),
            'media'   => Media::find($id),
            default   => null,
        };
    }

    private function actorId(Request $request): string
    {
        return $request->header('X-Actor-ID', '00000000-0000-0000-0000-000000000001');
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/workflow/{type}/{id}/submit
    // -------------------------------------------------------------------------

    public function submit(Request $request, string $type, string $id): JsonResponse
    {
        return $this->doTransition($request, $type, $id, 'in_review');
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/workflow/{type}/{id}/request-changes
    // -------------------------------------------------------------------------

    public function requestChanges(Request $request, string $type, string $id): JsonResponse
    {
        return $this->doTransition($request, $type, $id, 'draft');
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/workflow/{type}/{id}/approve   — enforces WR-002
    // -------------------------------------------------------------------------

    public function approve(Request $request, string $type, string $id): JsonResponse
    {
        // platform.admin may self-approve so they can manage the full workflow
        // when operating without a second reviewer account.
        $adminUser   = $request->attributes->get('admin_user');
        $bypassWr002 = $adminUser && ($adminUser->role ?? '') === 'platform.admin';

        return $this->doTransition($request, $type, $id, 'approved', $bypassWr002);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/workflow/{type}/{id}/publish
    // -------------------------------------------------------------------------

    public function publish(Request $request, string $type, string $id): JsonResponse
    {
        $entity = $this->resolveEntity($type, $id);

        if ($entity === null) {
            return $this->notFound($type, $id);
        }

        $actorId = $this->actorId($request);
        $locale  = $request->get('locale', 'en');

        // Run publish validation gate before committing the transition
        $gate = $this->workflow->runPublishValidationGate($type, $entity, $locale);

        if (! $gate['is_valid']) {
            return response()->json([
                'error'    => 'Publish validation gate failed. Resolve the errors below before publishing.',
                'errors'   => $gate['errors'],
                'warnings' => $gate['warnings'],
            ], 422);
        }

        try {
            $this->workflow->publish($type, $entity, $actorId);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $entity->refresh();

        return response()->json([
            'status'       => 'published',
            'published_at' => $entity->published_at,
            'object_type'  => $type,
            'object_id'    => $id,
        ]);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/workflow/{type}/{id}/schedule
    // -------------------------------------------------------------------------

    public function schedule(Request $request, string $type, string $id): JsonResponse
    {
        $request->validate([
            'scheduled_at' => 'required|date|after:now',
        ]);

        $entity = $this->resolveEntity($type, $id);

        if ($entity === null) {
            return $this->notFound($type, $id);
        }

        $actorId = $this->actorId($request);

        try {
            // Persist scheduled_at before the transition so observers see it
            $entity->scheduled_at = $request->scheduled_at;
            $entity->save();

            $this->workflow->transition($type, $entity, 'scheduled', $actorId, $request->get('notes'));
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        return response()->json([
            'status'       => 'scheduled',
            'scheduled_at' => $request->scheduled_at,
            'object_type'  => $type,
            'object_id'    => $id,
        ]);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/workflow/{type}/{id}/unpublish
    // -------------------------------------------------------------------------

    public function unpublish(Request $request, string $type, string $id): JsonResponse
    {
        $request->validate([
            'mode' => 'nullable|in:retract,revert_to_draft,suppress',
        ]);

        $entity = $this->resolveEntity($type, $id);

        if ($entity === null) {
            return $this->notFound($type, $id);
        }

        $actorId = $this->actorId($request);
        $mode    = $request->get('mode', 'retract');

        try {
            $this->workflow->unpublish($type, $entity, $actorId, $mode);
        } catch (\RuntimeException | \InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $entity->refresh();

        return response()->json([
            'status'      => $entity->status,
            'object_type' => $type,
            'object_id'   => $id,
        ]);
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    private function doTransition(Request $request, string $type, string $id, string $toStatus, bool $bypassWr002 = false): JsonResponse
    {
        $entity = $this->resolveEntity($type, $id);

        if ($entity === null) {
            return $this->notFound($type, $id);
        }

        $actorId = $this->actorId($request);

        try {
            $this->workflow->transition($type, $entity, $toStatus, $actorId, $request->get('notes'), $bypassWr002);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        return response()->json([
            'status'      => $toStatus,
            'object_type' => $type,
            'object_id'   => $id,
        ]);
    }

    // -------------------------------------------------------------------------
    // GET /api/admin/transitions/{type}/{id}
    // -------------------------------------------------------------------------

    public function transitions(string $type, string $id): JsonResponse
    {
        $records = StatusTransition::where('object_type', $type)
            ->where('object_id', $id)
            ->orderBy('transitioned_at', 'asc')
            ->get();

        return response()->json($records);
    }

    private function notFound(string $type, string $id): JsonResponse
    {
        return response()->json([
            'error' => "No {$type} found with id '{$id}'. Supported types: page, section, block, media.",
        ], 404);
    }
}
