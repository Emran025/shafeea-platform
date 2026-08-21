/**
 * blockFields — Type-safe field extractors for BlockPayload
 * Replaces the repetitive `String((b.fields as Record<string, unknown>)?.key ?? '')`
 * pattern that appears across all section and block components.
 */
import type { BlockPayload } from '../types/engine';

type Fields = Record<string, unknown>;

/**
 * Extract a string field from a block's fields object.
 * Returns an empty string if the key is absent or the value is nullish.
 */
export function getTextField(block: BlockPayload, key: string): string {
    return String((block.fields as Fields)?.[key] ?? '');
}

/**
 * Extract a boolean field from a block's fields object.
 */
export function getBoolField(block: BlockPayload, key: string, fallback = false): boolean {
    return Boolean((block.fields as Fields)?.[key] ?? fallback);
}

/**
 * Extract a typed field value with a fallback.
 */
export function getField<T>(block: BlockPayload, key: string, fallback: T): T {
    const value = (block.fields as Fields)?.[key];
    return (value !== undefined && value !== null) ? value as T : fallback;
}
