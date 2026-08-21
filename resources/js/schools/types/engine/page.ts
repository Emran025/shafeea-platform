/**
 * ACCSYSTEM Engine — Page Types
 * Page metadata, core page object, warnings, and the PagePayload
 * that is delivered inside a PageContract.
 */
import type { MediaPayload } from './primitives';
import type { SectionPayload } from './sections';
import type { Navigation } from './navigation';

export interface HreflangEntry { locale: string; url: string; }

export interface PageMeta {
    seo_title:       string;
    seo_description: string;
    og_title:        string | null;
    og_description:  string | null;
    og_image:        MediaPayload | null;
    robots:          string;
    canonical_url:   string;
    hreflang:        HreflangEntry[];
    schema_markup:   string | null;
}

export interface PageCore {
    id:             string;
    slug:           string;
    type:           string;
    classification: string;
    anchor_ids:     string[];
}

export interface CompositionWarning {
    code:        string;
    object_type: string;
    object_id:   string;
    message:     string;
    severity:    'info' | 'warning' | 'error';
}

export interface BreadcrumbEntry {
    slug:  string;
    label: string;
}

export interface PagePayload {
    page:             PageCore;
    navigation:       Navigation;
    sections:         SectionPayload[];
    meta:             PageMeta;
    breadcrumb_path?: BreadcrumbEntry[];
    warnings?:        CompositionWarning[];
}
