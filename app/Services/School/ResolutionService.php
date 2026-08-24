<?php

namespace App\Services\School;

use App\Models\Cms\Block;
use App\Models\Cms\Media;
use App\Models\Cms\Page;

/**
 * Handles all ambiguity, fallback, and conflict resolution during composition
 * (Resolution.md). Every resolution outcome is governed by a declared strategy.
 * Unknown states are treated as excluded — the engine never guesses.
 */
class ResolutionService
{
    private const ENGINE_FALLBACK_LOCALE  = 'en';
    private const BROKEN_LINK_POLICY      = 'keep_with_warning';   // CR-default

    // -------------------------------------------------------------------------
    // 1. Locale Resolution
    // -------------------------------------------------------------------------

    /**
     * Resolves the best locale content for a block given the request locale and
     * the section's locale_strategy ('fallback' | 'strict').
     *
     * Returns:
     *   ['content' => array, 'locale' => string, 'is_fallback' => bool]
     *   or null if no resolvable locale exists (block should be excluded).
     */
    public function resolveBlockLocale(
        Block  $block,
        string $requestedLocale,
        string $localeStrategy,
        string $tenantDefaultLocale = 'en',
    ): ?array {
        $localeContent = $block->locale_content ?? [];

        // Attempt 1: requested locale
        if (isset($localeContent[$requestedLocale]) && $this->isLocaleComplete($localeContent[$requestedLocale])) {
            return [
                'content'     => $localeContent[$requestedLocale],
                'locale'      => $requestedLocale,
                'is_fallback' => false,
            ];
        }

        // If strategy is strict: no fallback — exclude the block
        if ($localeStrategy === 'strict') {
            return null;
        }

        // Attempt 2: tenant default locale
        if (
            $tenantDefaultLocale !== $requestedLocale
            && isset($localeContent[$tenantDefaultLocale])
            && $this->isLocaleComplete($localeContent[$tenantDefaultLocale])
        ) {
            return [
                'content'     => $localeContent[$tenantDefaultLocale],
                'locale'      => $tenantDefaultLocale,
                'is_fallback' => true,
            ];
        }

        // Attempt 3: engine fallback locale ('en')
        if (
            self::ENGINE_FALLBACK_LOCALE !== $requestedLocale
            && self::ENGINE_FALLBACK_LOCALE !== $tenantDefaultLocale
            && isset($localeContent[self::ENGINE_FALLBACK_LOCALE])
            && $this->isLocaleComplete($localeContent[self::ENGINE_FALLBACK_LOCALE])
        ) {
            return [
                'content'     => $localeContent[self::ENGINE_FALLBACK_LOCALE],
                'locale'      => self::ENGINE_FALLBACK_LOCALE,
                'is_fallback' => true,
            ];
        }

        // No resolvable locale — block must be excluded
        return null;
    }

    private function isLocaleComplete(array $content): bool
    {
        return ! empty($content) && ($content['is_complete'] ?? false);
    }

    // -------------------------------------------------------------------------
    // 2. Missing Block Resolution
    // -------------------------------------------------------------------------

    /**
     * Categorises a missing/invalid block reference.
     * Returns ['strategy' => 'exclude_section'|'exclude_block', 'warning' => array].
     */
    public function resolveMissingBlock(string $blockId, bool $isRequired): array
    {
        $warning = $this->buildWarning(
            code: 'BLOCK_REFERENCE_UNRESOLVED',
            objectType: 'block',
            objectId: $blockId,
            message: "Block reference '{$blockId}' could not be resolved.",
            severity: 'warning',
        );

        if ($isRequired) {
            return ['strategy' => 'exclude_section', 'warning' => $warning];
        }

        return ['strategy' => 'exclude_block', 'warning' => $warning];
    }

    // -------------------------------------------------------------------------
    // 3. Media Resolution
    // -------------------------------------------------------------------------

    /**
     * Resolves a media reference to a composed media array.
     * Returns null if media is not ready (and emits a warning if $warnings is passed).
     */
    public function resolveMedia(?string $mediaId, string $locale, array &$warnings = []): ?array
    {
        if ($mediaId === null) {
            return null;
        }

        $media = Media::find($mediaId);

        if ($media === null || $media->status !== 'ready') {
            $warnings[] = $this->buildWarning(
                code: 'MEDIA_REFERENCE_UNRESOLVED',
                objectType: 'media',
                objectId: $mediaId ?? 'null',
                message: "Media reference '{$mediaId}' does not resolve to a ready media object.",
                severity: 'warning',
            );
            return null;
        }

        $localeMeta = $media->resolveLocaleMeta($locale) ?? [];

        return [
            'id'           => $media->id,
            'type'         => $media->type,
            'alt_text'     => $localeMeta['alt_text'] ?? '',
            'caption'      => $localeMeta['caption'] ?? null,
            'is_decorative' => false,
            'variants'     => $media->delivery_variants ?? [],
        ];
    }

    // -------------------------------------------------------------------------
    // 4. Section Validity Resolution
    // -------------------------------------------------------------------------

    /**
     * Returns the strategy to apply when a section fails SectionCompositionPolicy.
     * Governed by PageCompositionPolicy.fallback_policy.
     */
    public function resolveSectionValidity(
        string $fallbackPolicy,
        string $sectionId,
        string $sectionType,
        string $reason,
        array  &$warnings = [],
    ): string {
        $warnings[] = $this->buildWarning(
            code: 'SECTION_EXCLUDED_INVALID',
            objectType: 'section',
            objectId: $sectionId,
            message: "Section '{$sectionType}' excluded: {$reason}",
            severity: 'warning',
        );

        return match ($fallbackPolicy) {
            'show_partial'        => 'exclude_section',
            'show_none'           => 'abort_composition',
            'show_error_contract' => 'partial_contract',
            default               => 'exclude_section',
        };
    }

    // -------------------------------------------------------------------------
    // 5. Page Fallback Resolution
    // -------------------------------------------------------------------------

    /**
     * Builds the error payload for cases where the page cannot be composed.
     *
     * Cases (Resolution.md §5):
     *   A: page not found / deleted           → PAGE_NOT_FOUND, 404
     *   B: page archived                       → PAGE_ARCHIVED,  410
     *   C: page restricted for this audience  → PAGE_RESTRICTED, 403
     *   D: page has zero composable sections  → EmptyPageContract (handled by CompositionService)
     */
    public function buildPageFallback(string $case, array $navigation = []): array
    {
        return match ($case) {
            'not_found'  => $this->errorPayload('PAGE_NOT_FOUND', 404,  'The requested page does not exist.', $navigation),
            'archived'   => $this->errorPayload('PAGE_ARCHIVED',  410,  'The requested page has been archived.', $navigation),
            'restricted' => $this->errorPayload('PAGE_RESTRICTED', 403, 'The requested page is not accessible for this audience.', $navigation),
            default      => $this->errorPayload('PAGE_NOT_FOUND', 404,  'The requested page could not be resolved.', $navigation),
        };
    }

    private function errorPayload(string $errorType, int $httpHint, string $message, array $navigation): array
    {
        return [
            'contract_type' => 'error',
            'payload'       => [
                'error_type' => $errorType,
                'http_hint'  => $httpHint,
                'message'    => $message,
                'navigation' => $navigation,
            ],
        ];
    }

    // -------------------------------------------------------------------------
    // 6. CTA Destination Resolution
    // -------------------------------------------------------------------------

    /**
     * Resolves an action destination. Applies the engine's broken-link policy.
     * Returns the action array with 'is_broken_destination' populated (always present — CTR-001).
     */
    public function resolveCtaDestination(array $action, bool $isPreview, array &$warnings = []): array
    {
        $destination     = $action['destination'] ?? [];
        $destinationType = $destination['type'] ?? null;
        $isBroken        = false;

        if ($destinationType === 'internal_page') {
            $slug = $destination['value'] ?? null;
            if ($slug !== null) {
                $page = Page::where('slug', $slug)->first();
                if ($page === null || ! in_array($page->status, ['published'], true)) {
                    $isBroken = true;
                    $warnings[] = $this->buildWarning(
                        code: 'BROKEN_CTA_DESTINATION',
                        objectType: 'block',
                        objectId: $action['id'] ?? 'unknown',
                        message: "CTA destination slug '{$slug}' does not resolve to a published page.",
                        severity: 'warning',
                    );
                }
            }
        }

        $action['is_broken_destination'] = $isBroken;

        return $action;
    }

    // -------------------------------------------------------------------------
    // 7. Navigation Gap Resolution
    // -------------------------------------------------------------------------

    /**
     * Registers a navigation gap warning. Returns warning array.
     */
    public function resolveNavigationGap(string $pageId, array &$warnings = []): array
    {
        $warning = $this->buildWarning(
            code: 'NAV_ENTRY_UNRESOLVABLE',
            objectType: 'page',
            objectId: $pageId,
            message: "Navigation entry for page '{$pageId}' could not be resolved.",
            severity: 'warning',
        );

        $warnings[] = $warning;
        return $warning;
    }

    // -------------------------------------------------------------------------
    // Warning builder
    // -------------------------------------------------------------------------

    public function buildWarning(
        string $code,
        string $objectType,
        string $objectId,
        string $message,
        string $severity = 'warning',
    ): array {
        return [
            'code'        => $code,
            'object_type' => $objectType,
            'object_id'   => $objectId,
            'message'     => $message,
            'severity'    => $severity,
        ];
    }
}
