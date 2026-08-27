<?php

namespace App\Observers;

use App\Models\Cms\Section;

/**
 * SectionObserver — enforces engine-level write constraints on Section mutations.
 *
 * Rules enforced:
 *   SR-004  section type is immutable after first publish
 *           Once a section has been published (published_at is not null),
 *           its type cannot be changed. This prevents rendering contract
 *           breakage in clients that have cached the section type.
 */
class SectionObserver
{
    /**
     * Called before UPDATE.
     */
    public function updating(Section $section): void
    {
        // SR-004: type immutability post-first-publish
        if ($section->isDirty('type') && $section->published_at !== null) {
            $originalType = $section->getOriginal('type');
            $newType = $section->type;

            throw new \RuntimeException(
                'SR-004: Section type cannot be changed after it has been published. '
                    ."Current type: '{$originalType}', attempted: '{$newType}'."
            );
        }
    }
}
