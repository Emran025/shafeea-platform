/**
 * ACCSYSTEM Engine — Primitive Types
 * Scalar enumerations, shared value objects, and payload primitives
 * that are referenced by all other engine type modules.
 */

// ─── Scalar Enumerations ─────────────────────────────────────────────────────

export type RenderContext   = 'light' | 'dark';
export type DisplayCase     = 'uppercase' | 'lowercase_product';
export type SiteStatus      = 'live' | 'coming_soon' | 'archived' | 'draft';
export type DestinationType = 'internal_page' | 'anchor' | 'external_url' | 'download';
export type ContractType    = 'page' | 'error' | 'partial';

// ─── Value Objects ────────────────────────────────────────────────────────────

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

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface MediaPayload {
    id:            string;
    type:          string;
    alt_text:      string;
    caption:       string | null;
    is_decorative: boolean;
    variants:      MediaVariant[];
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
