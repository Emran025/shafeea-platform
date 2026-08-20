/**
 * resolveHref
 * Single canonical href resolver for Destination objects.
 * Eliminates the duplicated local functions that existed in
 * HeroSection and ActionRenderer.
 */
import type { Destination } from '../types/engine';

export function resolveHref(destination: Destination | undefined | null): string {
    if (!destination) return '#';

    switch (destination.type) {
        case 'internal_page': return '/' + destination.value;
        case 'anchor':        return '#' + destination.value;
        case 'external_url':
        case 'download':      return destination.value || '#';
        default:              return destination.value || '#';
    }
}
