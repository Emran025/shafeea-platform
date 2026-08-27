<?php

namespace App\Engine;

use Carbon\Carbon;

/**
 * Immutable value object representing the request context passed to every
 * layer of the composition pipeline (Composition.md — CompositionContext).
 *
 * Constructed from the HTTP request headers by ContentController.
 */
final class CompositionContext
{
    public function __construct(
        public readonly string $locale,
        public readonly string $audience,
        public readonly bool $isPreview,
        public readonly Carbon $resolvedAt,
        public readonly ?string $requestId,
        public readonly ?string $schoolCode = null,  // School tenant identifier (school_code slug)
    ) {}

    // -------------------------------------------------------------------------
    // Derived helpers
    // -------------------------------------------------------------------------

    public function localeDirection(): string
    {
        return in_array($this->locale, ['ar', 'he', 'fa', 'ur'], true) ? 'rtl' : 'ltr';
    }

    public function isAdminPreview(): bool
    {
        return $this->audience === 'admin_preview';
    }

    public function isPublic(): bool
    {
        return $this->audience === 'public';
    }

    public function isAuthenticated(): bool
    {
        return $this->audience === 'authenticated';
    }

    /**
     * A status is "composable" when the object can appear in composition
     * results for this context (Visibility.md — STATUS CHECK).
     */
    public function isComposableStatus(string $status): bool
    {
        if ($this->isPreview && $this->isAdminPreview()) {
            return in_array($status, ['draft', 'approved', 'published', 'scheduled'], true);
        }

        return in_array($status, ['published', 'scheduled'], true);
    }

    /**
     * Returns the subset of fields exposed in the ComposedPage.context
     * (Composition.md — CompositionContext, excludes request_id and resolved_at).
     */
    public function toContractArray(string $engineVersion = '1.0.0', string $contractVersion = 'rendering_contract@1.0'): array
    {
        return [
            'locale' => $this->locale,
            'locale_direction' => $this->localeDirection(),
            'audience' => $this->audience,
            'is_preview' => $this->isPreview,
            'engine_version' => $engineVersion,
            'contract_version' => $contractVersion,
        ];
    }
}
