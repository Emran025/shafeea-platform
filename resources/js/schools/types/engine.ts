import { Navigation } from 'react-router-dom';
import { DestinationType, DisplayCase, SiteStatus } from './engine/primitives';

/**
 * ACCSYSTEM Engine — Type System Entry Point (Compatibility Shim)
 *
 * All engine types have been split into focused sub-modules under engine/.
 * This file re-exports everything so existing imports (`from '../types/engine'`)
 * continue to work without modification.
 *
 * Prefer importing from the sub-modules directly in new code:
 *   import type { BlockPayload } from '../types/engine/blocks';
 */
export * from './engine/index';

export type SectionType =
  | 'hero' | 'narrative' | 'value_proposition' | 'platform_showcase'
  | 'leadership' | 'statistics' | 'testimonial' | 'cta_band'
  | 'legal_body' | 'contact_form' | 'navigation_anchor' | 'freeform'
  | 'problem_statement' | 'solution_overview' | 'capability_grid' | 'ecosystem_diagram'
  | 'use_case_grid' | 'industry_grid' | 'pricing_card_row' | 'pricing_table'
  | 'in_page_nav' | 'breadcrumb' | 'customer_story_grid' | 'blog_post_grid'
  | (string & {});

export type BlockType =
  | 'headline' | 'subheadline' | 'label' | 'rich_text' | 'quote'
  | 'cta' | 'platform_card' | 'product_gateway_cta' | 'person_card'
  | 'feature_item' | 'stat_item' | 'media' | 'media_group' | 'form_definition'
  | 'nav_link' | 'caption'
  | 'capability_card' | 'use_case_card' | 'industry_card' | 'platform_recommendation'
  | 'pricing_tier_card' | 'feature_row' | 'video_embed' | 'breadcrumb_trail'
  | 'customer_story_card' | 'blog_post_card'
  | (string & {});

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface ColorTokens {
  primary: string;
  accent:  string;
}

export interface Destination {
  type:  DestinationType;
  value: string;
}

export interface MediaVariant {
  breakpoint?: string;
  url:         string;
  width?:      number;
  height?:     number;
  format?:     string;
}

export interface MediaPayload {
  id:           string;
  type:         string;
  alt_text:     string;
  caption:      string | null;
  is_decorative: boolean;
  variants:     MediaVariant[];
}

export interface ActionPayload {
  type:                  string;
  label:                 string;
  destination:           Destination;
  is_broken_destination: boolean;
  open_in_new_tab:       boolean;
  position:              number;
}

export interface BlockConfig {
  is_decorative:  boolean;
  is_featured:    boolean;
  display_weight: number;
}

// ─── Block field shapes (per type) ───────────────────────────────────────────

export interface HeadlineFields     { text: string; }
export interface SubheadlineFields  { text: string; }
export interface LabelFields        { text: string; }
export interface QuoteFields        { text: string; attribution?: string; }
export interface CtaFields          { label: string; destination: Destination; intent?: 'primary' | 'secondary' | 'tertiary'; open_in_new_tab?: boolean; }
export interface FeatureItemFields  { label: string; description: string; }
export interface StatItemFields     { value: string; unit?: string | null; descriptor?: string; }
export interface PersonCardFields   { name: string; title?: string; bio?: string; }
export interface FormDefinitionFields { form_id: string; title?: string; }

export interface RichTextMark { type: string; attrs?: Record<string, unknown>; }
export interface RichTextNode {
  type:     string;
  attrs?:   Record<string, unknown>;
  content?: RichTextNode[];
  text?:    string;
  marks?:   RichTextMark[];
}
export interface RichTextFields { content: RichTextNode; }

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

export type BlockFields = Record<string, unknown>;

// ─── Block & Section ─────────────────────────────────────────────────────────

export interface BlockPayload {
  id:                string;
  type:              BlockType;
  position:          number;
  locale:            string;
  is_fallback_locale: boolean;
  fields:            BlockFields;
  content?:          Record<string, unknown>;
  media:             MediaPayload | null;
  actions:           ActionPayload[];
  config:            BlockConfig;
}

export interface SectionPayload {
  id:                   string;
  type:                 SectionType;
  anchor_id:            string | null;
  position:             number;
  group:                string | null;
  background_image_url: string | null;
  custom_css_classes:   string | null;
  blocks:               BlockPayload[];
}
// ─── Page ────────────────────────────────────────────────────────────────────

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

// ─── Contracts ───────────────────────────────────────────────────────────────

export interface PagePayload {
  page:       PageCore;
  navigation: Navigation;
  sections:   SectionPayload[];
  meta:       PageMeta;
  warnings?:  CompositionWarning[];
}

export interface ErrorPayload {
  error_type: string;
  http_hint:  number;
  message:    string;
  navigation: Navigation;
}

export interface PageContract {
  contract_version: string;
  contract_type:    'page' | 'partial';
  engine_version:   string;
  request_id:       string;
  composed_at:      string;
  payload:          PagePayload;
}

export interface ErrorContract {
  contract_version: string;
  contract_type:    'error';
  engine_version:   string;
  request_id:       string;
  composed_at:      string;
  payload:          ErrorPayload;
}

export type ContractEnvelope = PageContract | ErrorContract;

// ─── Type guards ─────────────────────────────────────────────────────────────

export function isPageContract(c: ContractEnvelope): c is PageContract {
  return c.contract_type === 'page' || c.contract_type === 'partial';
}

export function isErrorContract(c: ContractEnvelope): c is ErrorContract {
  return c.contract_type === 'error';
}
