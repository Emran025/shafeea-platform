/**
 * admin/types/index.ts — Canonical Admin Type Exports
 * All admin domain types. Canonical location is admin/types/.
 * The legacy admin/types.ts re-exports from here.
 */

export type AuthorRole =
    | 'content.author'
    | 'content.editor'
    | 'content.publisher'
    | 'platform.admin'
    | 'ops.manager'
    | 'ops.manager'
    | 'inquiry.faq'
    | 'inquiry.support'
    | 'inquiry.manager'
    | 'content.supervisor'
    | 'inquiry.email';

export type WorkflowStatus =
    | 'draft'
    | 'in_review'
    | 'approved'
    | 'scheduled'
    | 'published'
    | 'archived'
    | 'hidden';

export type ObjectType = 'page' | 'section' | 'block' | 'media';

export interface AdminActor {
    id:    string;
    name:  string;
    email: string;
    roles: AuthorRole[];
    role: AuthorRole;
}

export interface AdminPage {
    id:                           string;
    slug:                         string;
    type:                         string;
    site_scope:                   string;
    status:                       WorkflowStatus;

    // PageIdentity
    identity_title:               Record<string, string> | null;
    identity_purpose:             Record<string, string> | null;
    identity_owner:               string | null;
    identity_canonical_url:       string | null;
    identity_classification:      'public' | 'restricted' | null;

    // PageHierarchy
    parent_id:                    string | null;
    hierarchy_depth:              number;
    hierarchy_position:           number;
    hierarchy_include_in_nav:     boolean;
    hierarchy_nav_label:          Record<string, string> | null;

    // PageCompositionPolicy
    composition_section_order:    string | null;
    composition_allow_dynamic:    boolean;
    composition_max_sections:     number | null;
    composition_fallback_policy:  string | null;

    // PageMeta
    meta_seo_title:               Record<string, string> | null;
    meta_seo_description:         Record<string, string> | null;
    meta_og_title:                Record<string, string> | null;
    meta_og_description:          Record<string, string> | null;
    meta_og_image:                Record<string, unknown> | null;
    meta_robots:                  string | null;
    meta_schema_markup:           string | null;
    meta_hreflang:                Record<string, string> | null;

    // Audit
    created_by:                   string;
    last_modified_by:             string;
    published_at:                 string | null;
    updated_at:                   string;
    created_at:                   string;
    sections?:                    AdminSection[];
}

export interface AdminSection {
    id:                   string;
    page_id:              string;
    type:                 string;
    status:               WorkflowStatus;
    identity_name:        string | null;
    identity_anchor_id:   string | null;
    ordering_position:    number;
    published_at:         string | null;
    updated_at:           string;
    background_image_url: string | null;
    custom_css_classes:   string | null;
    blocks?:              AdminBlock[];
}

export interface AdminBlock {
    id:          string;
    type:        string;
    status:      WorkflowStatus;
    content:     Record<string, unknown> | null;
    published_at: string | null;
    updated_at:  string;
}

export interface StatusTransition {
    id:             string;
    object_type:    ObjectType;
    object_id:      string;
    from_status:    string;
    to_status:      string;
    transitioned_by: string;
    transitioned_at: string;
    notes:          string | null;
}

export interface PaginatedResponse<T> {
    data:         T[];
    current_page: number;
    last_page:    number;
    per_page:     number;
    total:        number;
}

export interface WorkflowResult {
    status:       string;
    object_type:  string;
    object_id:    string;
    published_at?: string;
    scheduled_at?: string;
}
