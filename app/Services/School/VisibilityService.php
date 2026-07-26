<?php

namespace App\Services\School;

use App\Engine\Schools\CompositionContext;
use App\Models\Cms\Block;
use App\Models\Cms\Page;
use App\Models\Cms\Section;

/**
 * Evaluates the 6-step visibility decision for each content object
 * during the composition pipeline (Visibility.md).
 *
 * Visibility decisions cascade downward:
 *   Page [excluded] → all sections excluded → all blocks excluded
 *   Section [hidden] → all blocks in section hidden
 *   Block [hidden] → only that block hidden
 */
class VisibilityService
{
    // -------------------------------------------------------------------------
    // Page Visibility — 2 checks (status + classification)
    // -------------------------------------------------------------------------

    public function evaluatePage(Page $page, CompositionContext $ctx): array
    {
        // STEP 1: STATUS CHECK
        if (! $ctx->isComposableStatus($page->status)) {
            return $this->excluded('status_check', "Page status '{$page->status}' is not composable for this context.");
        }

        // STEP 2: CLASSIFICATION CHECK
        // A restricted page must never appear for public or authenticated audiences (AR-002).
        $classification = $page->identity_classification ?? 'public';

        if ($classification === 'restricted' && $ctx->isPublic()) {
            return $this->excluded('classification_check', 'Restricted page excluded for public audience.');
        }

        if ($classification === 'restricted' && $ctx->isAuthenticated()) {
            return $this->excluded('classification_check', 'Restricted page excluded for authenticated audience.');
        }

        if ($classification === 'internal' && $ctx->isPublic()) {
            return $this->excluded('classification_check', 'Internal page excluded for public audience.');
        }

        return $this->visible();
    }

    // -------------------------------------------------------------------------
    // Section Visibility — 6 checks (status + audience + schedule + locale + flag)
    // -------------------------------------------------------------------------

    public function evaluateSection(Section $section, CompositionContext $ctx): array
    {
        // STEP 1: STATUS CHECK
        if (! $ctx->isComposableStatus($section->status)) {
            return $this->excluded('status_check', "Section status '{$section->status}' is not composable for this context.");
        }

        // STEP 3: AUDIENCE CHECK (AR-001 — most critical invariant)
        $audienceCheck = $this->checkAudience($section->visibility_audience ?? ['public'], $ctx);
        if ($audienceCheck !== null) {
            return $this->hidden('audience_check', $audienceCheck);
        }

        // STEP 4: SCHEDULE CHECK
        // Admin preview bypasses scheduling (Visibility.md — Preview Mode Override).
        if (! $ctx->isAdminPreview()) {
            $scheduleCheck = $this->checkSchedule(
                $section->visibility_visible_from,
                $section->visibility_visible_until,
                $ctx,
            );
            if ($scheduleCheck !== null) {
                return $this->hidden('schedule_check', $scheduleCheck);
            }
        }

        // STEP 5: LOCALE FILTER CHECK
        $localeFilter = $section->visibility_locale_filter;
        if ($localeFilter !== null) {
            $filterCheck = $this->checkLocaleFilter($localeFilter, $ctx->locale);
            if ($filterCheck !== null) {
                return $this->hidden('locale_filter_check', $filterCheck);
            }
        }

        // STEP 6: FLAG CHECK
        // manual_suppress still applies in admin preview (Visibility.md — Preview Mode Override).
        $flag = $section->visibility_flag;
        if ($flag !== null && ($flag['is_active'] ?? false)) {
            return $this->hidden('flag_check', "Active visibility flag: {$flag['type']}.");
        }

        return $this->visible();
    }

    // -------------------------------------------------------------------------
    // Block Visibility — 1 check (status only; audience/schedule cascade from section)
    // -------------------------------------------------------------------------

    public function evaluateBlock(Block $block, CompositionContext $ctx): array
    {
        // STEP 1: STATUS CHECK
        // Blocks inherit audience/schedule rules from their parent section.
        // The only block-level check is status.
        if (! $ctx->isComposableStatus($block->status)) {
            return $this->excluded('status_check', "Block status '{$block->status}' is not composable for this context.");
        }

        return $this->visible();
    }

    // -------------------------------------------------------------------------
    // Internal check helpers
    // -------------------------------------------------------------------------

    /**
     * Returns a reason string if audience check fails, null if it passes.
     * AR-001: public contracts must never contain content not marked public.
     */
    private function checkAudience(array $sectionAudience, CompositionContext $ctx): ?string
    {
        // Empty audience treated as ['public'] (soft defect, handled upstream)
        if (empty($sectionAudience)) {
            $sectionAudience = ['public'];
        }

        return match ($ctx->audience) {
            'public'        => in_array('public', $sectionAudience, true)
                ? null
                : 'Section audience does not include "public".',
            'authenticated' => ! empty(array_intersect(['public', 'authenticated'], $sectionAudience))
                ? null
                : 'Section audience requires higher privilege.',
            'admin_preview' => null, // admin_preview sees all audiences
            default         => 'Unknown audience type.',
        };
    }

    /**
     * Returns a reason string if schedule check fails, null if it passes.
     * visible_until is exclusive (Visibility.md).
     */
    private function checkSchedule(?string $visibleFrom, ?string $visibleUntil, CompositionContext $ctx): ?string
    {
        $now = $ctx->resolvedAt;

        if ($visibleFrom !== null && $now->lt($visibleFrom)) {
            return "Content not yet visible (visible_from: {$visibleFrom}).";
        }

        if ($visibleUntil !== null && $now->gte($visibleUntil)) {
            return "Content has expired (visible_until: {$visibleUntil}).";
        }

        return null;
    }

    /**
     * Returns a reason string if locale filter check fails, null if it passes.
     */
    private function checkLocaleFilter(array $filter, string $locale): ?string
    {
        $mode    = $filter['mode'] ?? 'include';
        $locales = $filter['locales'] ?? [];

        if ($mode === 'include' && ! in_array($locale, $locales, true)) {
            return "Locale '{$locale}' not in locale_filter include list.";
        }

        if ($mode === 'exclude' && in_array($locale, $locales, true)) {
            return "Locale '{$locale}' is excluded by locale_filter.";
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Decision constructors
    // -------------------------------------------------------------------------

    private function visible(): array
    {
        return ['outcome' => 'visible', 'reason' => null];
    }

    private function hidden(string $check, string $reason): array
    {
        return ['outcome' => 'hidden', 'reason' => "{$check}: {$reason}"];
    }

    private function excluded(string $check, string $reason): array
    {
        return ['outcome' => 'excluded', 'reason' => "{$check}: {$reason}"];
    }
}
