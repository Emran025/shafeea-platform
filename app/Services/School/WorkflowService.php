<?php

namespace App\Services\School;

use App\Models\Cms\Block;
use App\Models\Cms\Page;
use App\Models\Cms\PublishBundle;
use App\Models\Cms\PublishEvent;
use App\Models\Cms\Section;
use App\Models\Cms\StatusTransition;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Enforces the authoring and publishing state machines (Authoring.md, Publishing.md)
 * and the Publish Validation Gate (Publishing.md).
 *
 * All state transitions are recorded in status_transitions (append-only audit trail).
 * All publish events are recorded in publish_events (append-only publish audit trail).
 */
class WorkflowService
{
    // -------------------------------------------------------------------------
    // Valid state transitions — authoring + publishing combined
    // -------------------------------------------------------------------------

    private const TRANSITIONS = [
        'draft'     => ['in_review'],
        'in_review' => ['draft', 'approved'],
        'approved'  => ['published', 'scheduled', 'draft'],
        'published' => ['archived', 'draft', 'hidden'],
        'scheduled' => ['approved', 'published', 'archived'],
        'hidden'    => ['published', 'archived'],
        'archived'  => [],
        'deleted'   => [],
    ];

    // -------------------------------------------------------------------------
    // Transition validation
    // -------------------------------------------------------------------------

    /**
     * Returns ['can' => bool, 'reason' => string|null].
     *
     * @param bool $bypassWr002  When true, the WR-002 self-approval check is skipped.
     *                           Pass true only for platform.admin actors.
     */
    public function canTransition(Model $object, string $toStatus, string $actorId, bool $bypassWr002 = false): array
    {
        $fromStatus = $object->status;

        $allowed = self::TRANSITIONS[$fromStatus] ?? [];

        if (! in_array($toStatus, $allowed, true)) {
            return [
                'can'    => false,
                'reason' => "Cannot transition from '{$fromStatus}' to '{$toStatus}'.",
            ];
        }

        // WR-002: no self-approval — checked when toStatus is 'approved'
        // Bypassed for platform.admin users (single-admin teams).
        if ($toStatus === 'approved' && ! $bypassWr002) {
            $lastModifiedBy = $object->last_modified_by ?? null;
            if ($lastModifiedBy !== null && $lastModifiedBy === $actorId) {
                return [
                    'can'    => false,
                    'reason' => 'WR-002: Self-approval is not permitted. The approver must differ from the last modifier.',
                ];
            }
        }

        return ['can' => true, 'reason' => null];
    }

    // -------------------------------------------------------------------------
    // Core transition — apply + record
    // -------------------------------------------------------------------------

    public function transition(
        string $objectType,
        Model $object,
        string $toStatus,
        string $actorId,
        ?string $notes = null,
        bool $bypassWr002 = false,
    ): void {
        $fromStatus = $object->status;

        $check = $this->canTransition($object, $toStatus, $actorId, $bypassWr002);
        if (! $check['can']) {
            throw new \RuntimeException($check['reason']);
        }

        $object->status = $toStatus;
        $object->last_modified_by = $actorId;
        $object->save();

        StatusTransition::record(
            objectType: $objectType,
            objectId: $object->id,
            fromStatus: $fromStatus,
            toStatus: $toStatus,
            transitionedBy: $actorId,
            notes: $notes,
        );

        if ($objectType === 'section') {
            $sourceStatuses = match ($toStatus) {
                'in_review' => ['draft'],
                'approved'  => ['in_review'],
                'draft'     => ['in_review'],
                'scheduled' => ['approved'],
                default     => [],
            };
            if (! empty($sourceStatuses)) {
                $blocks = $object->blocks()->whereIn('status', $sourceStatuses)->get();
                foreach ($blocks as $block) {
                    $this->transition('block', $block, $toStatus, $actorId, $notes, $bypassWr002);
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // Publish Validation Gate (Publishing.md)
    // -------------------------------------------------------------------------

    /**
     * Runs all pre-flight checks before a publish action is committed.
     * Returns ['is_valid' => bool, 'errors' => [], 'warnings' => []].
     */
    public function runPublishValidationGate(
        string $objectType,
        Model $object,
        string $locale = 'en',
    ): array {
        $errors   = [];
        $warnings = [];

        // --- BLOCKING CHECKS ---

        // status_check: must be in approved status (WR-003)
        if ($object->status !== 'approved') {
            $errors[] = [
                'code'    => 'status_check',
                'message' => "Content must be in 'approved' status before publishing. Current: '{$object->status}'.",
            ];
        }

        // locale_completeness: canonical locale content must be is_complete: true
        if ($objectType === 'block') {
            $localeContent = $object->locale_content ?? [];
            $canonicalContent = $localeContent[$locale] ?? $localeContent['en'] ?? null;

            if ($canonicalContent === null || ! ($canonicalContent['is_complete'] ?? false)) {
                $errors[] = [
                    'code'    => 'locale_completeness',
                    'message' => "Block content is not marked is_complete in canonical locale '{$locale}'.",
                ];
            }

            // media_integrity: all media refs resolve to ready media
            $mediaId = $object->media_id;
            if ($mediaId !== null) {
                $media = \App\Models\Cms\Media::find($mediaId);
                if ($media === null || $media->status !== 'ready') {
                    $errors[] = [
                        'code'    => 'media_integrity',
                        'message' => "Media reference '{$mediaId}' does not resolve to a ready media object.",
                    ];
                }
            }
        }

        if ($objectType === 'section') {
            $policy = $object->composition_policy ?? [];
            $minBlocks = $policy['min_blocks'] ?? 0;

            $publishedBlockCount = $object->blocks()
                ->whereIn('status', ['approved', 'published', 'scheduled'])
                ->count();

            if ($publishedBlockCount < $minBlocks) {
                $errors[] = [
                    'code'    => 'min_blocks',
                    'message' => "Section requires at least {$minBlocks} approved blocks; found {$publishedBlockCount}.",
                ];
            }

            // required_types: all required block types must be present
            $requiredTypes = $policy['required_types'] ?? [];
            if (! empty($requiredTypes)) {
                $presentTypes = $object->blocks()
                    ->whereIn('status', ['approved', 'published', 'scheduled'])
                    ->pluck('type')
                    ->toArray();

                foreach ($requiredTypes as $requiredType) {
                    if (! in_array($requiredType, $presentTypes, true)) {
                        $errors[] = [
                            'code'    => 'required_blocks',
                            'message' => "Required block type '{$requiredType}' is not present in the section.",
                        ];
                    }
                }
            }
        }

        // --- WARNING CHECKS ---

        if ($objectType === 'page') {
            $meta = $object->page_meta ?? [];
            $enMeta = $meta['en'] ?? null;
            if ($enMeta === null || empty($enMeta['og_image_id'])) {
                $warnings[] = [
                    'code'    => 'og_image_missing',
                    'message' => 'Page has no og_image declared in PageMeta.',
                ];
            }
        }

        if ($objectType === 'block') {
            $localeContent = $object->locale_content ?? [];
            if (! isset($localeContent['ar']) || ! ($localeContent['ar']['is_complete'] ?? false)) {
                $warnings[] = [
                    'code'    => 'rtl_locale_completeness',
                    'message' => 'RTL locale (ar) content is absent or incomplete.',
                ];
            }
        }

        return [
            'is_valid' => empty($errors),
            'errors'   => $errors,
            'warnings' => $warnings,
        ];
    }

    // -------------------------------------------------------------------------
    // Publish action
    // -------------------------------------------------------------------------

    public function publish(
        string $objectType,
        Model $object,
        string $actorId,
        string $triggerType = 'immediate',
        ?Carbon $scheduledAt = null,
    ): void {
        $validationResult = $this->runPublishValidationGate($objectType, $object);

        if (! $validationResult['is_valid']) {
            $errorMessages = collect($validationResult['errors'])->pluck('message')->join('; ');
            throw new \RuntimeException("Publish validation failed: {$errorMessages}");
        }

        $previousStatus = $object->status;

        if ($triggerType === 'scheduled' && $scheduledAt !== null) {
            $object->status       = 'scheduled';
            $object->scheduled_at = $scheduledAt;
            $object->scheduled_by = $actorId;
        } else {
            $object->status       = 'published';
            $object->published_at = now();
            $object->published_by = $actorId;
        }

        $object->last_modified_by = $actorId;
        $object->save();

        $resultingStatus = $object->status;

        StatusTransition::record(
            objectType: $objectType,
            objectId: $object->id,
            fromStatus: $previousStatus,
            toStatus: $resultingStatus,
            transitionedBy: $actorId,
        );

        PublishEvent::record(
            eventType: $triggerType === 'scheduled' ? 'scheduled' : 'published',
            objectType: $objectType,
            objectId: $object->id,
            triggeredBy: $actorId,
            previousStatus: $previousStatus,
            resultingStatus: $resultingStatus,
            validationResult: $validationResult,
        );

        if ($objectType === 'section') {
            $blocks = $object->blocks()->whereIn('status', ['approved', 'scheduled'])->get();
            foreach ($blocks as $block) {
                $this->publish('block', $block, $actorId, $triggerType, $scheduledAt);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Unpublish action (Publishing.md)
    // -------------------------------------------------------------------------

    /**
     * @param string $mode  'retract' → archived | 'revert_to_draft' → draft | 'suppress' → hidden
     */
    public function unpublish(
        string $objectType,
        Model $object,
        string $actorId,
        string $mode = 'retract',
    ): void {
        $previousStatus  = $object->status;
        $resultingStatus = match ($mode) {
            'retract'         => 'archived',
            'revert_to_draft' => 'draft',
            'suppress'        => 'hidden',
            default           => throw new \InvalidArgumentException("Unknown unpublish mode: {$mode}"),
        };

        $object->status           = $resultingStatus;
        $object->last_modified_by = $actorId;
        $object->save();

        StatusTransition::record(
            objectType: $objectType,
            objectId: $object->id,
            fromStatus: $previousStatus,
            toStatus: $resultingStatus,
            transitionedBy: $actorId,
        );

        PublishEvent::record(
            eventType: 'unpublished',
            objectType: $objectType,
            objectId: $object->id,
            triggeredBy: $actorId,
            previousStatus: $previousStatus,
            resultingStatus: $resultingStatus,
        );

        if ($objectType === 'section') {
            $blocks = $object->blocks()
                ->whereIn('status', ['published', 'scheduled', 'hidden'])
                ->get();
            foreach ($blocks as $block) {
                $this->unpublish('block', $block, $actorId, $mode);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Bundle publish — WR-006 atomic bundle enforcement
    // -------------------------------------------------------------------------

    public function publishBundle(PublishBundle $bundle, string $actorId): void
    {
        $validation = $bundle->validateAllMembersApproved();

        if (! $validation['valid']) {
            throw new \RuntimeException(
                'WR-006: Bundle cannot publish — not all members are in approved status. '
                    . 'Failing members: ' . json_encode($validation['failing_members'])
            );
        }

        foreach ($bundle->members as $member) {
            $object = $member->resolveObject();
            if ($object !== null) {
                $this->publish($member->object_type, $object, $actorId);
            }
        }

        $bundle->status = 'published';
        $bundle->save();

        PublishEvent::record(
            eventType: 'bundle_published',
            objectType: 'bundle',
            objectId: $bundle->id,
            triggeredBy: $actorId,
            previousStatus: 'ready',
            resultingStatus: 'published',
        );
    }

    // -------------------------------------------------------------------------
    // WR-005: Edit published block → create new draft version
    // -------------------------------------------------------------------------

    /**
     * Creates a new draft Block that is a version-child of the published block.
     * The published block stays live until the new version completes the publish cycle.
     */
    public function createDraftVersion(Block $publishedBlock, string $actorId): Block
    {
        if ($publishedBlock->status !== 'published') {
            throw new \RuntimeException('WR-005: createDraftVersion only applies to published blocks.');
        }

        $newBlock = $publishedBlock->replicate();
        $newBlock->id               = Str::uuid()->toString();
        $newBlock->status           = 'draft';
        $newBlock->parent_version_id = $publishedBlock->id;
        $newBlock->published_at     = null;
        $newBlock->published_by     = null;
        $newBlock->created_by       = $actorId;
        $newBlock->last_modified_by = $actorId;
        $newBlock->version_number   = ($publishedBlock->version_number ?? 1) + 1;
        $newBlock->save();

        StatusTransition::record(
            objectType: 'block',
            objectId: $newBlock->id,
            fromStatus: 'initial',
            toStatus: 'draft',
            transitionedBy: $actorId,
            notes: "Draft version of published block {$publishedBlock->id} (WR-005).",
        );

        return $newBlock;
    }
}
