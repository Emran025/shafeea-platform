/**
 * ACCSYSTEM Engine — Navigation Types (v2.0 contract)
 * Navigation tree structures rendered in the contract payload.
 */
import type { ActionPayload, MediaPayload } from './primitives';

export interface NavEntry {
    label:                string;
    destination_type:     'internal_page' | 'external_url';
    destination_value:    string;
    position:             number;
    is_badge_highlighted: boolean;
    badge_text:           string | null;
}

export interface FeaturedNavBlock {
    headline:    string;
    description: string | null;
    media:       MediaPayload | null;
    cta:         ActionPayload;
}

export interface NavColumn {
    column_id:      string;
    label:          string | null;
    position:       number;
    entries:        NavEntry[];
    featured_block: FeaturedNavBlock | null;
}

export interface NavigationGroup {
    group_id: string;
    label:    string;
    type:     'mega_menu' | 'dropdown' | 'direct_link';
    position: number;
    columns:  NavColumn[];
}

export interface Navigation {
    locale:  string;
    primary: NavigationGroup[];
}
