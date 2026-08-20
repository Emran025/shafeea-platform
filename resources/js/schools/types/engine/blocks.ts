/**
 * ACCSYSTEM Engine — Block Types
 * Block domain: type union, all field shapes per block type, and BlockPayload.
 */
import type { MediaPayload, ActionPayload, BlockConfig, Destination, DisplayCase, SiteStatus, ColorTokens } from './primitives';

// ─── Block Type Union ─────────────────────────────────────────────────────────

export type BlockType =
    | 'headline' | 'subheadline' | 'label' | 'rich_text' | 'quote'
    | 'cta' | 'platform_card' | 'product_gateway_cta' | 'person_card'
    | 'feature_item' | 'stat_item' | 'media' | 'media_group' | 'form_definition'
    | 'nav_link' | 'caption'
    | 'capability_card' | 'use_case_card' | 'industry_card' | 'platform_recommendation'
    | 'pricing_tier_card' | 'feature_row' | 'video_embed' | 'breadcrumb_trail'
    | 'customer_story_card' | 'blog_post_card'
    | (string & {});

// ─── Field Shapes (per block type) ───────────────────────────────────────────

export interface HeadlineFields    { text: string; }
export interface SubheadlineFields { text: string; }
export interface LabelFields       { text: string; }
export interface QuoteFields       { text: string; attribution?: string; }

export interface CtaFields {
    label:           string;
    destination:     Destination;
    intent?:         'primary' | 'secondary' | 'tertiary';
    open_in_new_tab?: boolean;
}

export interface FeatureItemFields { label: string; description: string; }
export interface StatItemFields    { value: string; unit?: string | null; descriptor?: string; }
export interface PersonCardFields  { name: string; title?: string; bio?: string; }
export interface FormDefinitionFields { form_id: string; title?: string; }

export interface CapabilityCardFields {
    label:       string;
    description: string;
}

export interface UseCaseCardFields {
    headline:           string;
    scenario_narrative: string;
    tags:               string[];
}

export interface IndustryCardFields {
    industry_name: string;
    description:   string;
    platforms:     string[];
}

export interface PlatformRecommendationFields {
    platform_name: string;
    description:   string;
}

export interface PricingTierCardFields {
    tier_name:        string;
    price:            string;
    price_descriptor: string;
    features:         string[];
    is_featured:      boolean;
}

export interface FeatureRowFields {
    feature_name: string;
    tier_values:  Record<string, string>;
}

export interface VideoEmbedFields {
    video_url: string;
    caption:   string | null;
}

export interface BreadcrumbTrailFields {
    path_entries: { label: string; url_path: string; }[];
}

export interface CustomerStoryCardFields {
    company_name:      string;
    headline:          string;
    metric_value:      string;
    metric_descriptor: string;
}

export interface BlogPostCardFields {
    title:    string;
    author:   string;
    date:     string;
    category: string;
    summary:  string;
}

// ─── Rich Text ────────────────────────────────────────────────────────────────

export interface RichTextMark { type: string; attrs?: Record<string, unknown>; }

export interface RichTextNode {
    type:     string;
    attrs?:   Record<string, unknown>;
    content?: RichTextNode[];
    text?:    string;
    marks?:   RichTextMark[];
}

export interface RichTextFields { content: RichTextNode; }

// ─── Platform Card ────────────────────────────────────────────────────────────

export interface PlatformCardFields {
    product_site_id:     string;
    entity_id:           string;
    canonical_name:      string;
    display_name:        string;
    display_case:        DisplayCase;
    positioning_tagline: string;
    color_tokens:        ColorTokens | null;
    site_label:          string;
    ecosystem_role:      string;
    short_description:   string;
    site_status:         SiteStatus;
    cta_label:           string;
    cta_url:             string | null;
    cta_is_available:    boolean;
    unavailable_label:   string;
}

// ─── Generic fields fallback ──────────────────────────────────────────────────

export type BlockFields = Record<string, unknown>;

// ─── Block Payload ────────────────────────────────────────────────────────────

export interface BlockPayload {
    id:                 string;
    type:               BlockType;
    position:           number;
    locale:             string;
    is_fallback_locale: boolean;
    fields:             BlockFields;
    media:              MediaPayload | null;
    actions:            ActionPayload[];
    config:             BlockConfig;
}
