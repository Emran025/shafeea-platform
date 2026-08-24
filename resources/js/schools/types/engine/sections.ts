/**
 * ACCSYSTEM Engine — Section Types
 */
import type { BlockPayload } from './blocks';

export type SectionType =
    | 'hero' | 'narrative' | 'value_proposition' | 'platform_showcase'
    | 'leadership' | 'statistics' | 'testimonial' | 'cta_band'
    | 'legal_body' | 'contact_form' | 'navigation_anchor' | 'freeform'
    | 'problem_statement' | 'solution_overview' | 'capability_grid' | 'ecosystem_diagram'
    | 'use_case_grid' | 'industry_grid' | 'pricing_card_row' | 'pricing_table'
    | 'in_page_nav' | 'breadcrumb' | 'customer_story_grid' | 'blog_post_grid'
    // Phase 2 — media-rich layouts
    | 'media_spotlight' | 'media_banner' | 'video_feature' | 'media_grid'
    | (string & {});

export interface SectionPayload {
    id:        string;
    type:      SectionType;
    anchor_id: string | null;
    position:  number;
    group:     string | null;
    blocks:    BlockPayload[];
}
