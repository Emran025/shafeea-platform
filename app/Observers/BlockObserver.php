<?php

namespace App\Observers;

use App\Models\Cms\Block;

/**
 * BlockObserver — enforces engine-level write constraints on Block mutations.
 *
 * Rules enforced:
 *   SR-005  block type is immutable after creation
 *           Block type governs schema structure. Changing it would silently
 *           corrupt authored locale_content and invalidate cached contracts.
 *
 * Note: WR-005 (editing a published block → create draft version) is handled
 * upstream in BlockController::update() so it can return the new draft ID.
 * The observer enforces SR-005 as a last-resort safety net for any code path
 * that updates a block outside of the admin controller.
 */
class BlockObserver
{
    /**
     * Called before UPDATE.
     */
    public function updating(Block $block): void
    {
        // SR-005: block type immutability
        if ($block->isDirty('type')) {
            $originalType = $block->getOriginal('type');
            $newType      = $block->type;

            throw new \RuntimeException(
                "SR-005: Block type cannot be changed after creation. "
                    . "Current type: '{$originalType}', attempted: '{$newType}'."
            );
        }
    }
}
