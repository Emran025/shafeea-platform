<?php

namespace App\Observers;

use App\Models\Cms\Page;

/**
 * PageObserver — enforces engine-level write constraints on Page mutations.
 *
 * Rules enforced:
 *   SR-001  slug uniqueness across all pages (creating + updating)
 *   WR-001  only one corporate.index page per site_scope (creating only;
 *           type is immutable so a second check on update is unnecessary)
 */
class PageObserver
{
    /**
     * Called before INSERT.
     * Throws RuntimeException if an engine rule would be violated.
     * Laravel rolls back the write when an exception escapes an observer.
     */
    public function creating(Page $page): void
    {
        // SR-001: slug uniqueness
        if (Page::where('slug', $page->slug)->exists()) {
            throw new \RuntimeException(
                "SR-001: Slug '{$page->slug}' is already in use. Choose a unique slug."
            );
        }

        // WR-001: exactly one corporate.index page per site_scope
        if ($page->type === 'corporate.index') {
            $exists = Page::where('type', 'corporate.index')
                ->where('site_scope', $page->site_scope)
                ->where('status', '!=', 'deleted')
                ->exists();

            if ($exists) {
                throw new \RuntimeException(
                    "WR-001: A corporate.index page already exists for site_scope '{$page->site_scope}'. Only one is permitted."
                );
            }
        }
    }

    /**
     * Called before UPDATE.
     */
    public function updating(Page $page): void
    {
        // SR-001: slug uniqueness — only checked when slug is being changed
        if ($page->isDirty('slug')) {
            $taken = Page::where('slug', $page->slug)
                ->where('id', '!=', $page->id)
                ->exists();

            if ($taken) {
                throw new \RuntimeException(
                    "SR-001: Slug '{$page->slug}' is already in use by another page."
                );
            }
        }
    }
}
