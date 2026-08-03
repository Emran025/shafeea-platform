<?php

namespace App\Services\School;

use App\Engine\CompositionContext;
use App\Models\Cms\Block;
use App\Models\Cms\EntityIdentity;
use App\Models\Cms\Page;
use App\Models\Cms\Platform;
use App\Models\Cms\ProductSite;
use App\Models\Cms\Section;
use Illuminate\Support\Str;

/**
 * The Composition Engine — assembles domain objects into a fully composed page
 * ready to be serialised into a Rendering Contract (Composition.md).
 *
 * INVARIANTS:
 *   - Read-only: makes zero writes to any store (CR-003).
 *   - Deterministic: same context + same data → same output.
 *   - AR-001: public contracts never contain audience-restricted content.
 *   - CTR-003: warnings never appear in public contracts.
 */
class CompositionService
{
    private const ENGINE_VERSION   = '1.0.0';
    private const CONTRACT_VERSION = 'rendering_contract@2.0';

    public function __construct(
        private readonly VisibilityService $visibility,
        private readonly ResolutionService $resolution,
    ) {}

    // =========================================================================
    // PUBLIC — Entry point
    // =========================================================================

    /**
     * Runs the 7-step composition pipeline.
     * Returns a full contract envelope array ready for JSON serialisation.
     */
    public function compose(string $slug, CompositionContext $ctx): array
    {
        $compositionId = Str::uuid()->toString();
        $composedAt    = now()->toISOString();
        $warnings      = [];

        // -----------------------------------------------------------------
        // STEP 1: Page Resolution
        // -----------------------------------------------------------------
        [$page, $pageError] = $this->resolvePage($slug, $ctx, $warnings);

        if ($pageError !== null) {
            // Navigation still composed even on error (RenderingContract.md)
            $navigation = $this->composeNavigation($ctx, $warnings);
            $pageError['payload']['navigation'] = $navigation;
            return $this->envelope('error', $pageError['payload'], $compositionId, $composedAt, $ctx);
        }

        // -----------------------------------------------------------------
        // STEP 2: Section Resolution
        // -----------------------------------------------------------------
        [$composedSections, $abortComposition] = $this->resolveSections($page, $ctx, $warnings);

        if ($abortComposition) {
            $navigation = $this->composeNavigation($ctx, $warnings);
            return $this->envelope('error', [
                'error_type' => 'PAGE_NOT_FOUND',
                'http_hint'  => 500,
                'message'    => 'Page composition aborted due to fallback_policy: show_none.',
                'navigation' => $navigation,
            ], $compositionId, $composedAt, $ctx);
        }

        // -----------------------------------------------------------------
        // STEP 5: Navigation Composition
        // -----------------------------------------------------------------
        $navigation = $this->composeNavigation($ctx, $warnings);

        // -----------------------------------------------------------------
        // STEP 6: Page Meta Assembly
        // -----------------------------------------------------------------
        $meta = $this->composePageMeta($page, $ctx->locale);

        // -----------------------------------------------------------------
        // STEP 7: ComposedPage Construction
        // -----------------------------------------------------------------
        $anchorIds = collect($composedSections)
            ->pluck('anchor_id')
            ->filter()
            ->values()
            ->all();

        $pageCore = [
            'id'             => $page->id,
            'slug'           => $page->slug,
            'type'           => $page->type,
            'classification' => $page->identity_classification ?? 'public',
            'anchor_ids'     => $anchorIds,
        ];

        $payload = [
            'page'            => $pageCore,
            'navigation'      => $navigation,
            'sections'        => $composedSections,
            'meta'            => $meta,
            'breadcrumb_path' => $this->composeBreadcrumbPath($page, $ctx->locale),
        ];

        // Warnings only in admin_preview contracts (CTR-003)
        if ($ctx->isAdminPreview() && ! empty($warnings)) {
            $payload['warnings'] = $warnings;
        }

        $contractType = 'page';
        if (empty($composedSections)) {
            $warnings[] = $this->resolution->buildWarning(
                code: 'PAGE_HAS_NO_COMPOSABLE_SECTIONS',
                objectType: 'page',
                objectId: $page->id,
                message: 'Page has no composable sections after visibility evaluation.',
                severity: 'warning',
            );
            if ($ctx->isAdminPreview()) {
                $payload['warnings'] = $warnings;
            }
        }

        return $this->envelope($contractType, $payload, $compositionId, $composedAt, $ctx);
    }

    // =========================================================================
    // STEP 1 — Page Resolution
    // =========================================================================

    private function resolvePage(string $slug, CompositionContext $ctx, array &$warnings): array
    {
        $page = Page::where('slug', $slug)->first();

        if ($page === null) {
            return [null, $this->resolution->buildPageFallback('not_found')];
        }

        if (in_array($page->status, ['deleted'], true)) {
            return [null, $this->resolution->buildPageFallback('not_found')];
        }

        if ($page->status === 'archived') {
            return [null, $this->resolution->buildPageFallback('archived')];
        }

        $decision = $this->visibility->evaluatePage($page, $ctx);

        if ($decision['outcome'] === 'excluded') {
            if (($page->identity_classification ?? 'public') === 'restricted') {
                return [null, $this->resolution->buildPageFallback('restricted')];
            }
            return [null, $this->resolution->buildPageFallback('not_found')];
        }

        return [$page, null];
    }

    // =========================================================================
    // STEP 2–4 — Section + Block Resolution
    // =========================================================================

    private function resolveSections(Page $page, CompositionContext $ctx, array &$warnings): array
    {
        $allSections = $page->sections()
            ->with(['blocks' => fn($q) => $q->orderByPivot('position')])
            ->orderBy('ordering_position')
            ->get();

        $policy         = $page->composition_policy ?? [];
        $fallbackPolicy = $policy['fallback_policy'] ?? 'show_partial';
        $maxSections    = $policy['max_sections'] ?? PHP_INT_MAX;

        $composedSections = [];
        $partialFailures  = [];
        $heroSectionFound = false;

        foreach ($allSections as $section) {
            $decision = $this->visibility->evaluateSection($section, $ctx);

            if ($decision['outcome'] !== 'visible') {
                continue;
            }

            // UR-003: at most one hero section per page (composition time enforcement)
            if ($section->type === 'hero') {
                if ($heroSectionFound) {
                    $warnings[] = $this->resolution->buildWarning(
                        code: 'DUPLICATE_HERO_SECTION',
                        objectType: 'section',
                        objectId: $section->id,
                        message: 'Second hero section found — excluded from composition (UR-003).',
                        severity: 'warning',
                    );
                    continue;
                }
                $heroSectionFound = true;
            }

            // STEP 3: Block Resolution for this section
            [$composedBlocks, $sectionInvalid, $sectionWarnings] = $this->resolveBlocks($section, $ctx);
            $warnings = array_merge($warnings, $sectionWarnings);

            if ($sectionInvalid) {
                // STEP 4: Fallback Resolution
                $sectionPolicy = $section->composition_policy ?? [];
                $sectionMin    = $sectionPolicy['min_blocks'] ?? 0;

                $strategy = $this->resolution->resolveSectionValidity(
                    fallbackPolicy: $fallbackPolicy,
                    sectionId: $section->id,
                    sectionType: $section->type,
                    reason: "Section does not meet composition policy (min_blocks: {$sectionMin}).",
                    warnings: $warnings,
                );

                if ($strategy === 'abort_composition') {
                    return [[], true];
                }

                if ($strategy === 'partial_contract') {
                    $partialFailures[] = [
                        'section_type' => $section->type,
                        'reason'       => 'Section failed composition policy validation.',
                    ];
                }

                continue;
            }

            $composedSections[] = [
                'id'                   => $section->id,
                'type'                 => $section->type,
                'anchor_id'            => $section->anchor_id,
                'position'             => $section->position,
                'group'                => $section->group ?? null,
                'background_image_url' => $section->background_image_url ?? null,
                'custom_css_classes'   => $section->custom_css_classes ?? null,
                'blocks'               => $composedBlocks,
            ];

            if (count($composedSections) >= $maxSections) {
                break;
            }
        }

        return [$composedSections, false];
    }

    private function resolveBlocks(Section $section, CompositionContext $ctx): array
    {
        $sectionPolicy  = $section->composition_policy ?? [];
        $minBlocks      = $sectionPolicy['min_blocks'] ?? 0;
        $requiredTypes  = $sectionPolicy['required_types'] ?? [];
        $localeStrategy = $sectionPolicy['locale_strategy'] ?? 'fallback';

        $composedBlocks = [];
        $warnings       = [];
        $presentTypes   = [];

        foreach ($section->blocks as $block) {
            // Block visibility check
            $decision = $this->visibility->evaluateBlock($block, $ctx);
            if ($decision['outcome'] !== 'visible') {
                continue;
            }

            $pivotIsRequired = (bool) ($block->pivot?->is_required ?? false);

            // Locale resolution (STEP 3 — block locale content)
            $localeResult = $this->resolution->resolveBlockLocale($block, $ctx->locale, $localeStrategy);

            if ($localeResult === null) {
                $missing = $this->resolution->resolveMissingBlock($block->id, $pivotIsRequired);
                $warnings[] = $missing['warning'];

                if ($missing['strategy'] === 'exclude_section') {
                    return [[], true, $warnings];
                }

                continue;
            }

            if ($localeResult['is_fallback']) {
                $warnings[] = $this->resolution->buildWarning(
                    code: 'LOCALE_FALLBACK_APPLIED',
                    objectType: 'block',
                    objectId: $block->id,
                    message: "Block served in fallback locale '{$localeResult['locale']}' (requested: '{$ctx->locale}').",
                    severity: 'info',
                );
            }

            // Media resolution
            $composedMedia = $this->resolution->resolveMedia($block->media_id, $ctx->locale, $warnings);

            // If block IS the media and media is unresolvable → treat as missing
            if ($composedMedia === null && $block->type === 'media') {
                $missing = $this->resolution->resolveMissingBlock($block->id, $pivotIsRequired);
                $warnings[] = $missing['warning'];

                if ($missing['strategy'] === 'exclude_section') {
                    return [[], true, $warnings];
                }

                continue;
            }

            // Action / CTA resolution
            $actions = $this->resolveActions($block, $localeResult['content'], $ctx, $warnings);

            $composedBlock = [
                'id'                 => $block->id,
                'type'               => $block->type,
                'position'           => $block->pivot?->position ?? 0,
                'locale'             => $localeResult['locale'],
                'is_fallback_locale' => $localeResult['is_fallback'],
                'fields'             => $this->extractFields($block, $localeResult['content'], $ctx->locale, $warnings),
                'media'              => $composedMedia,
                'actions'            => $actions,
                'config'             => [
                    'is_decorative'  => (bool) ($block->is_decorative ?? false),
                    'is_featured'    => (bool) ($block->is_featured ?? false),
                    'display_weight' => $block->display_weight ?? 5,
                ],
            ];

            $composedBlocks[] = $composedBlock;
            $presentTypes[]   = $block->type;
        }

        // Validate section composition policy
        if (count($composedBlocks) < $minBlocks) {
            return [[], true, $warnings];
        }

        foreach ($requiredTypes as $requiredType) {
            if (! in_array($requiredType, $presentTypes, true)) {
                return [[], true, $warnings];
            }
        }

        return [$composedBlocks, false, $warnings];
    }

    // =========================================================================
    // Block helpers
    // =========================================================================

    /**
     * Extracts type-specific content fields from locale content.
     * For platform_card blocks, resolves live registry data from ProductSite + EntityIdentity.
     */
    private function extractFields(Block $block, array $localeContent, string $locale, array &$warnings): array
    {
        $fields = $localeContent['fields'] ?? [];

        if ($block->type === 'platform_card') {
            $fields = $this->resolvePlatformCardFields($block, $fields, $locale, $warnings);
        }

        return $fields;
    }

    /**
     * Resolves a platform_card block into a fully populated identity token contract.
     *
     * Per Identity.md: all platform_card blocks referencing a known entity must resolve
     * the EntityIdentity during composition. A missing entity identity is a composition error.
     *
     * Contract output structure (Identity.md "Identity Tokens in Rendering Contracts"):
     * {
     *   product_site_id, entity_id, canonical_name, display_name, display_case,
     *   positioning_tagline, color_tokens, site_label, ecosystem_role,
     *   short_description, site_status, cta_label, cta_url, cta_is_available,
     *   unavailable_label
     * }
     */
    private function resolvePlatformCardFields(
        Block  $block,
        array  $authoredFields,
        string $locale,
        array  &$warnings,
    ): array {
        $productSiteId = $authoredFields['product_site_id'] ?? null;

        if ($productSiteId === null) {
            $warnings[] = $this->resolution->buildWarning(
                code: 'PLATFORM_CARD_MISSING_SITE_ID',
                objectType: 'block',
                objectId: $block->id,
                message: 'platform_card block has no product_site_id in authored fields.',
                severity: 'error',
            );
            return $authoredFields;
        }

        // --- ProductSite lookup ---
        $productSite = ProductSite::find($productSiteId);

        if ($productSite === null) {
            $warnings[] = $this->resolution->buildWarning(
                code: 'PLATFORM_CARD_SITE_NOT_FOUND',
                objectType: 'block',
                objectId: $block->id,
                message: "platform_card: ProductSite '{$productSiteId}' not found in registry (PlatformRegistry.md Rule 3).",
                severity: 'error',
            );
            return $authoredFields;
        }

        // --- EntityIdentity lookup (platform_id === entity_id for the 3 products) ---
        $entityIdentity = EntityIdentity::find($productSite->platform_id);

        if ($entityIdentity === null) {
            $warnings[] = $this->resolution->buildWarning(
                code: 'PLATFORM_CARD_IDENTITY_NOT_FOUND',
                objectType: 'block',
                objectId: $block->id,
                message: "platform_card: EntityIdentity '{$productSite->platform_id}' not found (Identity.md Invariant 4).",
                severity: 'error',
            );
            // Fall through — return partial with what we have
        }

        // --- Platform registry lookup for tagline ---
        $platform          = Platform::find($productSite->platform_id);
        $positioningTagline = '';
        if ($platform !== null) {
            $positioningTagline = $platform->getTagline($locale);
        }

        // --- CTA resolution ---
        $isAvailable = $productSite->isCtaAvailable();
        $ctaUrl      = $isAvailable ? $productSite->resolveCanonicalUrl($locale) : null;

        // JSON columns are already cast to array by ProductSite model
        $ecosystemRole    = $productSite->identity_ecosystem_role ?? [];
        $shortDesc        = $productSite->identity_short_description ?? [];
        $siteLabel        = $productSite->identity_site_label ?? [];
        $ctaLabel         = $productSite->gateway_cta_label ?? [];
        $unavailableLabel = $productSite->gateway_unavailable_label ?? [];

        return [
            'product_site_id'    => $productSiteId,
            // Identity tokens (Identity.md rendering contract format)
            'entity_id'          => $entityIdentity?->entity_id ?? $productSite->platform_id,
            'canonical_name'     => $entityIdentity?->canonical_name ?? $productSite->identity_platform_name,
            'display_name'       => $entityIdentity?->displayName() ?? $productSite->identity_display_name,
            'display_case'       => $entityIdentity?->display_case ?? $productSite->identity_display_case,
            'positioning_tagline' => $positioningTagline,
            'color_tokens'       => $entityIdentity?->color_tokens,
            // Site data
            'site_label'         => $siteLabel[$locale]   ?? $siteLabel['en']   ?? '',
            'ecosystem_role'     => $ecosystemRole[$locale] ?? $ecosystemRole['en'] ?? '',
            'short_description'  => $shortDesc[$locale]   ?? $shortDesc['en']   ?? '',
            'site_status'        => $productSite->status,
            // Gateway CTA
            'cta_label'          => $ctaLabel[$locale]         ?? $ctaLabel['en']         ?? '',
            'cta_url'            => $ctaUrl,
            'cta_is_available'   => $isAvailable,
            'unavailable_label'  => $unavailableLabel[$locale] ?? $unavailableLabel['en'] ?? '',
        ];
    }

    /**
     * Resolves actions (CTA, download, external_link, anchor) for a block.
     */
    private function resolveActions(Block $block, array $localeContent, CompositionContext $ctx, array &$warnings): array
    {
        $rawActions = $localeContent['actions'] ?? $block->actions ?? [];

        if (empty($rawActions)) {
            return [];
        }

        $resolved = [];
        $position = 1;

        foreach ($rawActions as $action) {
            $action['id'] = $block->id;
            $action       = $this->resolution->resolveCtaDestination($action, $ctx->isPreview, $warnings);

            $resolved[] = [
                'type'                  => $action['type'] ?? 'cta',
                'label'                 => $action['label'] ?? '',
                'destination'           => $action['destination'] ?? ['type' => 'external', 'value' => '#'],
                'is_broken_destination' => $action['is_broken_destination'] ?? false,
                'open_in_new_tab'       => (bool) ($action['open_in_new_tab'] ?? false),
                'position'              => $position++,
            ];
        }

        return $resolved;
    }

    // =========================================================================
    // STEP 5 — Navigation Composition (CR-002)
    // =========================================================================

    private function composeNavigation(CompositionContext $ctx, array &$warnings): array
    {
        $groups = \App\Models\Cms\NavigationGroup::with(['columns.entries'])
            ->where('is_active', true)
            ->orderBy('position')
            ->get();

        $composedGroups = [];

        foreach ($groups as $group) {
            $groupLabel = $group->label[$ctx->locale] ?? $group->label['en'] ?? null;
            if ($groupLabel === null) {
                continue;
            }

            $composedColumns = [];

            foreach ($group->columns as $col) {
                $colLabel = $col->label[$ctx->locale] ?? $col->label['en'] ?? null;

                $composedEntries = [];
                foreach ($col->entries as $entry) {
                    $entryLabel = $entry->label[$ctx->locale] ?? $entry->label['en'] ?? null;
                    if ($entryLabel === null) {
                        continue;
                    }

                    if ($entry->destination_type === 'internal_page') {
                        $page = Page::where('slug', $entry->destination_value)->first();
                        if ($page === null || ! in_array($page->status, ['published'], true)) {
                            $warnings[] = $this->resolution->buildWarning(
                                code: 'BROKEN_NAV_ENTRY_DESTINATION',
                                objectType: 'navigation_entry',
                                objectId: $entry->id,
                                message: "Navigation entry destination slug '{$entry->destination_value}' does not resolve to a published page.",
                                severity: 'warning',
                            );
                        }
                    }

                    $composedEntries[] = [
                        'label'                => $entryLabel,
                        'destination_type'     => $entry->destination_type,
                        'destination_value'    => $entry->destination_value,
                        'position'             => (int) $entry->position,
                        'is_badge_highlighted' => (bool) $entry->is_badge_highlighted,
                        'badge_text'           => $entry->badge_text[$ctx->locale] ?? $entry->badge_text['en'] ?? null,
                    ];
                }

                $composedFeatured = null;
                if ($col->featured_block) {
                    $feat = $col->featured_block;
                    $featHeadline = $feat['headline'][$ctx->locale] ?? $feat['headline']['en'] ?? null;

                    if ($featHeadline !== null) {
                        $resolvedCta = $this->resolution->resolveCtaDestination([
                            'id' => $col->id,
                            'label' => $feat['cta_label'][$ctx->locale] ?? $feat['cta_label']['en'] ?? '',
                            'destination' => [
                                'type' => $feat['cta_destination_type'] ?? 'external_url',
                                'value' => $feat['cta_destination_value'] ?? '#',
                            ]
                        ], $ctx->isPreview, $warnings);

                        $composedFeatured = [
                            'headline'    => $featHeadline,
                            'description' => $feat['description'][$ctx->locale] ?? $feat['description']['en'] ?? null,
                            'media'       => isset($feat['media_id']) ? $this->resolution->resolveMedia($feat['media_id'], $ctx->locale, $warnings) : null,
                            'cta'         => [
                                'label'                 => $resolvedCta['label'] ?? '',
                                'destination'           => $resolvedCta['destination'] ?? ['type' => 'external_url', 'value' => '#'],
                                'is_broken_destination' => $resolvedCta['is_broken_destination'] ?? false,
                                'open_in_new_tab'       => false,
                                'position'              => 1,
                            ],
                        ];
                    }
                }

                $composedColumns[] = [
                    'column_id'      => $col->column_id,
                    'label'          => $colLabel,
                    'position'       => (int) $col->position,
                    'entries'        => $composedEntries,
                    'featured_block' => $composedFeatured,
                ];
            }

            $composedGroups[] = [
                'group_id' => $group->group_id,
                'label'    => $groupLabel,
                'type'     => $group->type,
                'position' => (int) $group->position,
                'columns'  => $composedColumns,
            ];
        }

        return [
            'locale'  => $ctx->locale,
            'primary' => $composedGroups,
        ];
    }

    private function composeBreadcrumbPath(Page $page, string $locale): array
    {
        $path = [];
        $current = $page;

        while ($current !== null) {
            $label = $this->getBreadcrumbLabel($current, $locale);

            array_unshift($path, [
                'slug'  => $current->slug,
                'label' => $label,
            ]);

            $current = $current->parent;
        }

        return $path;
    }

    private function getBreadcrumbLabel(Page $page, string $locale): string
    {
        $breadcrumbLabels = $page->breadcrumb_labels ?? [];
        $navLabels        = $page->nav_labels ?? [];
        $titles           = $page->identity_title ?? [];

        return $breadcrumbLabels[$locale]
            ?? $breadcrumbLabels['en']
            ?? $navLabels[$locale]
            ?? $navLabels['en']
            ?? $titles[$locale]
            ?? $titles['en']
            ?? '';
    }

    // =========================================================================
    // STEP 6 — Page Meta Assembly
    // =========================================================================

    private function composePageMeta(Page $page, string $locale): array
    {
        $pageMeta   = $page->page_meta ?? [];
        $localeMeta = $pageMeta[$locale] ?? $pageMeta['en'] ?? [];

        $ogImageId   = $localeMeta['og_image_id'] ?? null;
        $ogImageData = null;

        if ($ogImageId !== null) {
            $ogImageData = $this->resolution->resolveMedia($ogImageId, $locale);
        }

        $hreflang   = [];
        $allLocales = array_keys($pageMeta);
        foreach ($allLocales as $l) {
            $baseUrl    = config('app.url', 'https://accsystemerp.com');
            $localePath = $l === 'en' ? '' : "/{$l}";
            $hreflang[] = [
                'locale' => $l,
                'url'    => "{$baseUrl}{$localePath}/{$page->slug}",
            ];
        }

        $baseUrl      = config('app.url', 'https://accsystemerp.com');
        $localePath   = $locale === 'en' ? '' : "/{$locale}";
        $canonicalUrl = "{$baseUrl}{$localePath}/{$page->slug}";

        return [
            'seo_title'       => $localeMeta['seo_title'] ?? '',
            'seo_description' => $localeMeta['seo_description'] ?? '',
            'og_title'        => $localeMeta['og_title'] ?? null,
            'og_description'  => $localeMeta['og_description'] ?? null,
            'og_image'        => $ogImageData,
            'robots'          => $localeMeta['robots'] ?? 'index,follow',
            'canonical_url'   => $canonicalUrl,
            'hreflang'        => $hreflang,
            'schema_markup'   => $localeMeta['schema_markup'] ?? null,
        ];
    }

    // =========================================================================
    // STEP 7 — Contract Envelope Construction
    // =========================================================================

    private function envelope(
        string $contractType,
        array  $payload,
        string $compositionId,
        string $composedAt,
        CompositionContext $ctx,
    ): array {
        return [
            'contract_version' => self::CONTRACT_VERSION,
            'contract_type'    => $contractType,
            'engine_version'   => self::ENGINE_VERSION,
            'request_id'       => $ctx->requestId ?? Str::uuid()->toString(),
            'composed_at'      => $composedAt,
            'payload'          => $payload,
        ];
    }
}
