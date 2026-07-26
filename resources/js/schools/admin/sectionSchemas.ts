/**
 * Section schema registry — field definitions for all 28 section types.
 *
 * Each schema drives the admin Section Composer form.  A schema describes
 * what blocks a section contains, what fields each block has, and whether
 * a block can appear multiple times.
 */

export type FieldType = 'text' | 'textarea' | 'url' | 'select' | 'boolean';

export interface FieldDef {
    key:          string;
    label:        string;
    type:         FieldType;
    required?:    boolean;
    placeholder?: string;
    options?:     { value: string; label: string }[];
}

export interface BlockDef {
    key:       string;    // unique per section (used as form state key)
    blockType: string;    // stored in DB block.type
    label:     string;    // human label shown in form
    multiple?: boolean;   // can have multiple instances
    optional?: boolean;   // may be omitted entirely
    itemLabel?: string;   // label for each item in a multiple list
    required?:    boolean;
    fields:    FieldDef[];
}

export interface SectionTypeSchema {
    type:        string;
    label:       string;
    description: string;
    icon:        string;  // path to SVG in /icons/
    group:       'hero' | 'content' | 'grid' | 'media' | 'navigation' | 'platform' | 'legal' | 'newsroom';
    blocks:      BlockDef[];
}

// ─── Shared block snippets ────────────────────────────────────────────────

const LABEL_BLOCK: BlockDef = {
    key: 'label', blockType: 'label', label: 'Eyebrow Label', optional: true,
    fields: [{ key: 'text', label: 'Label text', type: 'text', placeholder: 'e.g. ENTERPRISE PLATFORM' }],
};

const HEADLINE_BLOCK: BlockDef = {
    key: 'headline', blockType: 'headline', label: 'Headline', required: true,
    fields: [{ key: 'text', label: 'Headline', type: 'textarea', required: true, placeholder: 'Section headline…' }],
};

const SUB_BLOCK: BlockDef = {
    key: 'subheadline', blockType: 'subheadline', label: 'Subheadline', optional: true,
    fields: [{ key: 'text', label: 'Subheadline', type: 'textarea', placeholder: 'Supporting sentence…' }],
};

const RICH_TEXT_BLOCK: BlockDef = {
    key: 'body', blockType: 'rich_text', label: 'Body text', optional: true,
    fields: [{ key: 'text', label: 'Body', type: 'textarea', placeholder: 'Paragraph text…' }],
};

const CTA_MULTI_BLOCK: BlockDef = {
    key: 'ctas', blockType: 'cta', label: 'Call-to-action buttons', multiple: true, optional: true,
    itemLabel: 'CTA',
    fields: [
        { key: 'label', label: 'Button label', type: 'text', required: true, placeholder: 'e.g. Watch Demo' },
        { key: 'destination', label: 'Link URL', type: 'url', placeholder: 'https://… or /page-slug' },
        { key: 'open_in_new_tab', label: 'Open in new tab', type: 'boolean' },
    ],
};

const SINGLE_CTA_BLOCK: BlockDef = {
    key: 'cta', blockType: 'cta', label: 'Call-to-action button', optional: true,
    fields: [
        { key: 'label', label: 'Button label', type: 'text', placeholder: 'e.g. Learn More' },
        { key: 'destination', label: 'Link URL', type: 'url', placeholder: '/page or https://…' },
    ],
};

// ─── Section schemas ──────────────────────────────────────────────────────

export const SECTION_SCHEMAS: SectionTypeSchema[] = [

    // ── hero ─────────────────────────────────────────────────────────────
    {
        type: 'hero', label: 'Hero', icon: '/icons/elearning_platform.svg',
        description: 'Primary above-the-fold statement with headline, sub, and CTAs.',
        group: 'hero',
        blocks: [
            LABEL_BLOCK,
            { ...HEADLINE_BLOCK, fields: [{ key: 'text', label: 'Headline', type: 'textarea', required: true, placeholder: 'Bold opening statement…' }] },
            SUB_BLOCK,
            CTA_MULTI_BLOCK,
        ],
    },

    // ── narrative ────────────────────────────────────────────────────────
    {
        type: 'narrative', label: 'Narrative', icon: '/icons/documents.svg',
        description: 'Explanatory story or editorial content with optional media.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK, RICH_TEXT_BLOCK, SINGLE_CTA_BLOCK,
        ],
    },

    // ── value_proposition ────────────────────────────────────────────────
    {
        type: 'value_proposition', label: 'Value Proposition', icon: '/icons/product.svg',
        description: 'Three- or four-column feature grid with icons, titles, and descriptions.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'features', blockType: 'feature_item', label: 'Feature items',
                multiple: true, itemLabel: 'Feature',
                fields: [
                    { key: 'label',       label: 'Feature title',       type: 'text',     required: true },
                    { key: 'description', label: 'Feature description', type: 'textarea', required: true },
                ],
            },
        ],
    },

    // ── platform_showcase ────────────────────────────────────────────────
    {
        type: 'platform_showcase', label: 'Platform Showcase', icon: '/icons/base.svg',
        description: 'Horizontal cards showcasing the three platforms with CTAs.',
        group: 'platform',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'platforms', blockType: 'platform_card', label: 'Platform cards',
                multiple: true, itemLabel: 'Platform',
                fields: [
                    { key: 'product_site_id', label: 'Platform ID', type: 'select', required: true, options: [
                        { value: 'ACCORE', label: 'accore' },
                        { value: 'ACCOMMERCE', label: 'accommerce' },
                        { value: 'QAYD', label: 'qayd' },
                    ]},
                    { key: 'cta_label', label: 'CTA label', type: 'text', placeholder: 'Explore platform' },
                ],
            },
        ],
    },

    // ── leadership ───────────────────────────────────────────────────────
    {
        type: 'leadership', label: 'Leadership', icon: '/icons/hr.svg',
        description: 'Team grid with headshots, names, and titles.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK,
            {
                key: 'people', blockType: 'person_card', label: 'Team members',
                multiple: true, itemLabel: 'Person',
                fields: [
                    { key: 'name',      label: 'Full name',  type: 'text',     required: true },
                    { key: 'title',     label: 'Job title',  type: 'text',     required: true },
                    { key: 'bio',       label: 'Short bio',  type: 'textarea' },
                    { key: 'image_url', label: 'Photo URL',  type: 'url' },
                ],
            },
        ],
    },

    // ── statistics ───────────────────────────────────────────────────────
    {
        type: 'statistics', label: 'Statistics', icon: '/icons/spreadsheet_dashboard.svg',
        description: 'Bold KPI numbers with labels in a horizontal band.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK,
            {
                key: 'stats', blockType: 'stat_item', label: 'Statistics',
                multiple: true, itemLabel: 'Stat',
                fields: [
                    { key: 'value', label: 'Stat value',  type: 'text',     required: true, placeholder: '99.9%' },
                    { key: 'label', label: 'Stat label',  type: 'text',     required: true, placeholder: 'Uptime SLA' },
                    { key: 'note',  label: 'Note / context', type: 'text', placeholder: 'Global average' },
                ],
            },
        ],
    },

    // ── testimonial ──────────────────────────────────────────────────────
    {
        type: 'testimonial', label: 'Testimonial', icon: '/icons/im_livechat.svg',
        description: 'Single large pull-quote with attribution.',
        group: 'content',
        blocks: [
            LABEL_BLOCK,
            {
                key: 'quote', blockType: 'quote', label: 'Quote',
                fields: [
                    { key: 'text',         label: 'Quote text',     type: 'textarea', required: true },
                    { key: 'author_name',  label: 'Author name',    type: 'text' },
                    { key: 'author_title', label: 'Author title',   type: 'text' },
                    { key: 'author_org',   label: 'Organisation',   type: 'text' },
                ],
            },
        ],
    },

    // ── cta_band ─────────────────────────────────────────────────────────
    {
        type: 'cta_band', label: 'CTA Band', icon: '/icons/marketing_automation.svg',
        description: 'Full-width dark band with headline and primary/secondary CTAs.',
        group: 'hero',
        blocks: [
            HEADLINE_BLOCK, SUB_BLOCK, CTA_MULTI_BLOCK,
        ],
    },

    // ── legal_body ───────────────────────────────────────────────────────
    {
        type: 'legal_body', label: 'Legal Body', icon: '/icons/industry_lawyer.svg',
        description: 'Long-form structured legal page body (privacy, terms, etc.).',
        group: 'legal',
        blocks: [
            HEADLINE_BLOCK,
            { key: 'label', blockType: 'label', label: 'Effective date label', optional: true,
              fields: [{ key: 'text', label: 'Effective date', type: 'text', placeholder: 'Effective date: June 2026' }] },
            {
                key: 'body', blockType: 'rich_text', label: 'Body sections',
                multiple: true, itemLabel: 'Section',
                fields: [
                    { key: 'content', label: 'Rich text content', type: 'textarea', required: true },
                ],
            },
        ],
    },

    // ── contact_form ─────────────────────────────────────────────────────
    {
        type: 'contact_form', label: 'Contact Form', icon: '/icons/frontdesk.svg',
        description: 'Structured intake form with configurable fields.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, RICH_TEXT_BLOCK,
            {
                key: 'form', blockType: 'form_definition', label: 'Form configuration',
                fields: [
                    { key: 'form_title',      label: 'Form title',         type: 'text',     placeholder: 'Send a Message' },
                    { key: 'submit_label',    label: 'Submit button label', type: 'text',    placeholder: 'Send Message' },
                    { key: 'success_message', label: 'Success message',    type: 'textarea', placeholder: 'Thank you!' },
                ],
            },
        ],
    },

    // ── navigation_anchor ────────────────────────────────────────────────
    {
        type: 'navigation_anchor', label: 'Navigation Anchor', icon: '/icons/website_links.svg',
        description: 'Sticky in-page anchor bar linking to sections below.',
        group: 'navigation',
        blocks: [
            {
                key: 'links', blockType: 'nav_link', label: 'Anchor links',
                multiple: true, itemLabel: 'Link',
                fields: [
                    { key: 'label',     label: 'Link label', type: 'text', required: true },
                    { key: 'anchor_id', label: 'Target anchor ID (no #)', type: 'text', required: true },
                ],
            },
        ],
    },

    // ── freeform ─────────────────────────────────────────────────────────
    {
        type: 'freeform', label: 'Freeform', icon: '/icons/web_studio.svg',
        description: 'Open rich text area for custom editorial content.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK,
            { ...RICH_TEXT_BLOCK, optional: false },
        ],
    },

    // ── problem_statement ────────────────────────────────────────────────
    {
        type: 'problem_statement', label: 'Problem Statement', icon: '/icons/knowledge.svg',
        description: 'Contrast-heavy section that frames the problem the platform solves.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK, RICH_TEXT_BLOCK,
        ],
    },

    // ── solution_overview ────────────────────────────────────────────────
    {
        type: 'solution_overview', label: 'Solution Overview', icon: '/icons/ai_app.svg',
        description: 'How the platform addresses the stated problem.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK, RICH_TEXT_BLOCK, CTA_MULTI_BLOCK,
        ],
    },

    // ── capability_grid ──────────────────────────────────────────────────
    {
        type: 'capability_grid', label: 'Capability Grid', icon: '/icons/databases.svg',
        description: 'Icon + label + description tile grid for platform capabilities.',
        group: 'grid',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'capabilities', blockType: 'feature_item', label: 'Capabilities',
                multiple: true, itemLabel: 'Capability',
                fields: [
                    { key: 'label',       label: 'Capability title',       type: 'text',     required: true },
                    { key: 'description', label: 'Capability description', type: 'textarea', required: true },
                    { key: 'icon',        label: 'Icon path (optional)',    type: 'text',     placeholder: '/icons/databases.svg' },
                ],
            },
        ],
    },

    // ── ecosystem_diagram ────────────────────────────────────────────────
    {
        type: 'ecosystem_diagram', label: 'Ecosystem Diagram', icon: '/icons/iot.svg',
        description: 'Visual diagram showing platform relationships and data flows.',
        group: 'platform',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK, RICH_TEXT_BLOCK,
        ],
    },

    // ── use_case_grid ────────────────────────────────────────────────────
    {
        type: 'use_case_grid', label: 'Use Case Grid', icon: '/icons/project.svg',
        description: 'Card grid of use cases or job-to-be-done scenarios.',
        group: 'grid',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'cases', blockType: 'feature_item', label: 'Use cases',
                multiple: true, itemLabel: 'Use case',
                fields: [
                    { key: 'label',       label: 'Use case title',       type: 'text',     required: true },
                    { key: 'description', label: 'Use case description', type: 'textarea', required: true },
                    { key: 'tag',         label: 'Persona/segment tag',  type: 'text',     placeholder: 'Enterprise' },
                ],
            },
        ],
    },

    // ── industry_grid ────────────────────────────────────────────────────
    {
        type: 'industry_grid', label: 'Industry Grid', icon: '/icons/hr_skills.svg',
        description: 'Grid of industry verticals with icons and short descriptors.',
        group: 'grid',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'industries', blockType: 'feature_item', label: 'Industries',
                multiple: true, itemLabel: 'Industry',
                fields: [
                    { key: 'label',       label: 'Industry name',        type: 'text',     required: true },
                    { key: 'description', label: 'Short descriptor',     type: 'text' },
                    { key: 'icon',        label: 'Icon path (optional)', type: 'text',     placeholder: '/icons/construction.svg' },
                ],
            },
        ],
    },

    // ── pricing_card_row ─────────────────────────────────────────────────
    {
        type: 'pricing_card_row', label: 'Pricing Card Row', icon: '/icons/sale.svg',
        description: 'Side-by-side pricing tier cards with feature lists and CTAs.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'tiers', blockType: 'pricing_tier', label: 'Pricing tiers',
                multiple: true, itemLabel: 'Tier',
                fields: [
                    { key: 'name',        label: 'Tier name',          type: 'text',     required: true },
                    { key: 'price',       label: 'Price display',      type: 'text',     placeholder: '€99 / mo' },
                    { key: 'description', label: 'Short pitch',        type: 'textarea' },
                    { key: 'features',    label: 'Feature list (one per line)', type: 'textarea' },
                    { key: 'cta_label',   label: 'CTA label',          type: 'text',     placeholder: 'Get started' },
                    { key: 'cta_url',     label: 'CTA URL',            type: 'url' },
                    { key: 'is_featured', label: 'Highlight as recommended', type: 'boolean' },
                ],
            },
        ],
    },

    // ── pricing_table ────────────────────────────────────────────────────
    {
        type: 'pricing_table', label: 'Pricing Table', icon: '/icons/spreadsheet.svg',
        description: 'Matrix-style feature comparison table across tiers.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'tiers', blockType: 'pricing_tier', label: 'Table columns (tiers)',
                multiple: true, itemLabel: 'Tier',
                fields: [
                    { key: 'name',  label: 'Tier name',  type: 'text', required: true },
                    { key: 'price', label: 'Price',       type: 'text', placeholder: '€99 / mo' },
                ],
            },
            {
                key: 'rows', blockType: 'feature_row', label: 'Feature rows',
                multiple: true, itemLabel: 'Feature',
                fields: [
                    { key: 'label', label: 'Feature name', type: 'text', required: true },
                    { key: 'tiers', label: 'Available in tiers (comma-separated names)', type: 'text' },
                ],
            },
        ],
    },

    // ── in_page_nav ──────────────────────────────────────────────────────
    {
        type: 'in_page_nav', label: 'In-Page Nav', icon: '/icons/website.svg',
        description: 'Tab-style top navigation that jumps to page anchors.',
        group: 'navigation',
        blocks: [
            {
                key: 'tabs', blockType: 'nav_link', label: 'Navigation tabs',
                multiple: true, itemLabel: 'Tab',
                fields: [
                    { key: 'label',     label: 'Tab label',   type: 'text', required: true },
                    { key: 'anchor_id', label: 'Anchor ID',   type: 'text', required: true },
                ],
            },
        ],
    },

    // ── breadcrumb ───────────────────────────────────────────────────────
    {
        type: 'breadcrumb', label: 'Breadcrumb', icon: '/icons/website_crm.svg',
        description: 'Top-of-page breadcrumb trail.',
        group: 'navigation',
        blocks: [
            {
                key: 'crumbs', blockType: 'nav_link', label: 'Breadcrumb items',
                multiple: true, itemLabel: 'Crumb',
                fields: [
                    { key: 'label', label: 'Label', type: 'text', required: true },
                    { key: 'url',   label: 'URL (leave blank for current page)', type: 'url' },
                ],
            },
        ],
    },

    // ── customer_story_grid ──────────────────────────────────────────────
    {
        type: 'customer_story_grid', label: 'Customer Story Grid', icon: '/icons/project_todo.svg',
        description: 'Featured card + list grid of customer success stories.',
        group: 'grid',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'stories', blockType: 'customer_story_card', label: 'Stories',
                multiple: true, itemLabel: 'Story',
                fields: [
                    { key: 'company',   label: 'Company name',        type: 'text',     required: true },
                    { key: 'outcome',   label: 'Headline / outcome',  type: 'text',     required: true },
                    { key: 'quote',     label: 'Pull-quote',          type: 'textarea' },
                    { key: 'image_url', label: 'Image URL',           type: 'url' },
                    { key: 'url',       label: 'Story URL',           type: 'url' },
                ],
            },
            SINGLE_CTA_BLOCK,
        ],
    },

    // ── blog_post_grid ───────────────────────────────────────────────────
    {
        type: 'blog_post_grid', label: 'Blog Post Grid', icon: '/icons/website_blog.svg',
        description: 'Card grid of blog posts with date, category, and thumbnails.',
        group: 'grid',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK,
            {
                key: 'posts', blockType: 'news_article_card', label: 'Posts',
                multiple: true, itemLabel: 'Post',
                fields: [
                    { key: 'title',     label: 'Post title',      type: 'text',    required: true },
                    { key: 'excerpt',   label: 'Short excerpt',   type: 'textarea' },
                    { key: 'image_url', label: 'Thumbnail URL',   type: 'url' },
                    { key: 'url',       label: 'Post URL',        type: 'url' },
                    { key: 'date',      label: 'Date',            type: 'text',    placeholder: 'June 2026' },
                    { key: 'category',  label: 'Category',        type: 'text',    placeholder: 'Product' },
                ],
            },
            SINGLE_CTA_BLOCK,
        ],
    },

    // ── media_spotlight ──────────────────────────────────────────────────
    {
        type: 'media_spotlight', label: 'Media Spotlight', icon: '/icons/sign.svg',
        description: 'Two-column layout: text on one side, featured image on other.',
        group: 'media',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK, RICH_TEXT_BLOCK,
            {
                key: 'media', blockType: 'media', label: 'Spotlight image', optional: true,
                fields: [
                    { key: 'url', label: 'Image URL', type: 'url' },
                    { key: 'alt', label: 'Alt text', type: 'text' },
                ],
            },
            SINGLE_CTA_BLOCK,
        ],
    },

    // ── media_banner ─────────────────────────────────────────────────────
    {
        type: 'media_banner', label: 'Media Banner', icon: '/icons/billboard_rental.svg',
        description: 'Full-width background image or video banner with overlay text.',
        group: 'media',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'media', blockType: 'media', label: 'Banner image/video',
                fields: [
                    { key: 'url', label: 'Media URL', type: 'url', required: true },
                    { key: 'alt', label: 'Alt text', type: 'text' },
                ],
            },
            CTA_MULTI_BLOCK,
        ],
    },

    // ── video_feature ────────────────────────────────────────────────────
    {
        type: 'video_feature', label: 'Video Feature', icon: '/icons/website_slides.svg',
        description: 'Featured video with heading and supporting text.',
        group: 'media',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, RICH_TEXT_BLOCK,
            {
                key: 'video', blockType: 'video_embed', label: 'Video',
                fields: [
                    { key: 'url', label: 'Video URL (YouTube / Vimeo / direct)', type: 'url', required: true },
                    { key: 'poster_url', label: 'Poster / thumbnail URL', type: 'url' },
                ],
            },
            {
                key: 'caption', blockType: 'caption', label: 'Caption', optional: true,
                fields: [{ key: 'text', label: 'Caption text', type: 'text' }],
            },
        ],
    },

    // ── media_grid ───────────────────────────────────────────────────────
    {
        type: 'media_grid', label: 'Media Grid', icon: '/icons/gallery.svg',
        description: 'Gallery grid of images.',
        group: 'media',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK,
            {
                key: 'images', blockType: 'media', label: 'Images',
                multiple: true, itemLabel: 'Image',
                fields: [
                    { key: 'url', label: 'Image URL', type: 'url', required: true },
                    { key: 'alt', label: 'Alt text', type: 'text' },
                    { key: 'caption', label: 'Caption (optional)', type: 'text' },
                ],
            },
        ],
    },

    // ── logo_cloud ───────────────────────────────────────────────────────
    {
        type: 'logo_cloud', label: 'Logo Cloud', icon: '/icons/partner_autocomplete.svg',
        description: 'Grayscale grid/ticker of customer or partner logos.',
        group: 'media',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK,
            {
                key: 'logos', blockType: 'media', label: 'Logos',
                multiple: true, itemLabel: 'Logo',
                fields: [
                    { key: 'url', label: 'Logo Image URL', type: 'url', required: true },
                    { key: 'alt', label: 'Partner name / Alt text', type: 'text' },
                ],
            },
        ],
    },

    // ── faq_accordion ────────────────────────────────────────────────────
    {
        type: 'faq_accordion', label: 'FAQ Accordion', icon: '/icons/survey.svg',
        description: 'Interactive frequently asked questions list (SEO-friendly).',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'items', blockType: 'feature_item', label: 'Questions & Answers',
                multiple: true, itemLabel: 'Q&A',
                fields: [
                    { key: 'label', label: 'Question', type: 'text', required: true },
                    { key: 'description', label: 'Answer text', type: 'textarea', required: true },
                ],
            },
        ],
    },

    // ── tabbed_switcher ──────────────────────────────────────────────────
    {
        type: 'tabbed_switcher', label: 'Tabbed Switcher', icon: '/icons/board.svg',
        description: 'Interactive switchable tabs to showcase product features.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'tabs', blockType: 'feature_item', label: 'Tabs',
                multiple: true, itemLabel: 'Tab',
                fields: [
                    { key: 'label', label: 'Tab title', type: 'text', required: true },
                    { key: 'description', label: 'Tab content', type: 'textarea', required: true },
                ],
            },
        ],
    },

    // ── resource_gate ────────────────────────────────────────────────────
    {
        type: 'resource_gate', label: 'Resource Gate', icon: '/icons/sign.svg',
        description: 'Gated document/file download with contact intake form.',
        group: 'content',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK, RICH_TEXT_BLOCK,
            {
                key: 'media', blockType: 'media', label: 'Asset document (PDF / sheet)',
                fields: [
                    { key: 'url', label: 'File URL', type: 'url', required: true },
                    { key: 'alt', label: 'File name / Alt text', type: 'text' },
                ],
            },
            {
                key: 'form', blockType: 'form_definition', label: 'Intake form configuration',
                fields: [
                    { key: 'title', label: 'Form title', type: 'text', placeholder: 'Download Resource' },
                    { key: 'submit_label', label: 'Download button label', type: 'text', placeholder: 'Get Download' },
                    { key: 'success_message', label: 'Success message', type: 'text', placeholder: 'Thank you! Your download is ready.' },
                ],
            },
            SINGLE_CTA_BLOCK,
        ],
    },

    // ── product_comparison ───────────────────────────────────────────────
    {
        type: 'product_comparison', label: 'Product Comparison', icon: '/icons/product_conversion.svg',
        description: 'Side-by-side platform feature and capability comparison matrix.',
        group: 'platform',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'platforms', blockType: 'platform_card', label: 'Platforms (columns)',
                multiple: true, itemLabel: 'Platform',
                fields: [
                    { key: 'product_site_id', label: 'Platform ID', type: 'select', required: true, options: [
                        { value: 'ACCORE', label: 'accore' },
                        { value: 'ACCOMMERCE', label: 'accommerce' },
                        { value: 'QAYD', label: 'qayd' },
                    ]},
                ],
            },
            {
                key: 'rows', blockType: 'feature_row', label: 'Comparison feature rows',
                multiple: true, itemLabel: 'Feature Row',
                fields: [
                    { key: 'label', label: 'Feature/Capability name', type: 'text', required: true },
                    { key: 'tiers', label: 'Available in platforms (comma-separated: ACCORE, ACCOMMERCE, QAYD)', type: 'text' },
                ],
            },
        ],
    },

    // ══════════════════════════════════════════════════════════════
    // NEWSROOM HUB SECTIONS
    // ══════════════════════════════════════════════════════════════

    // ── news_hero ─────────────────────────────────────────────────
    {
        type: 'news_hero', label: 'News Hero', icon: '/icons/mass_mailing.svg',
        description: 'Dark top-of-page hero for the News index with optional category filter tabs.',
        group: 'newsroom',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'categories', blockType: 'news_category', label: 'Category filter tabs',
                multiple: true, optional: true, itemLabel: 'Category',
                fields: [
                    { key: 'label', label: 'Category label', type: 'text', required: true, placeholder: 'e.g. Product' },
                ],
            },
        ],
    },

    // ── news_article_grid ─────────────────────────────────────────
    {
        type: 'news_article_grid', label: 'News Article Grid', icon: '/icons/website_blog.svg',
        description: 'Editorial list of news articles: date, category tag, title, thumbnail.',
        group: 'newsroom',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'articles', blockType: 'news_article_card', label: 'Articles',
                multiple: true, itemLabel: 'Article',
                fields: [
                    { key: 'title',     label: 'Article title',       type: 'text',    required: true },
                    { key: 'excerpt',   label: 'Short excerpt',       type: 'textarea' },
                    { key: 'url',       label: 'Article URL',         type: 'url' },
                    { key: 'date',      label: 'Date',                type: 'text',    placeholder: 'June 10, 2026' },
                    { key: 'category',  label: 'Category',            type: 'text',    placeholder: 'Product' },
                    { key: 'image_url', label: 'Thumbnail image URL', type: 'url' },
                ],
            },
            SINGLE_CTA_BLOCK,
        ],
    },

    // ── stories_hero ──────────────────────────────────────────────
    {
        type: 'stories_hero', label: 'Stories Hero', icon: '/icons/gamification.svg',
        description: 'Two-column Stories page opener: left heading + right featured story card.',
        group: 'newsroom',
        blocks: [
            HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'featured', blockType: 'customer_story_card', label: 'Featured story card',
                optional: true,
                fields: [
                    { key: 'company',   label: 'Company name',         type: 'text',    required: true },
                    { key: 'outcome',   label: 'Headline / outcome',   type: 'text',    required: true },
                    { key: 'quote',     label: 'Pull-quote',           type: 'textarea' },
                    { key: 'image_url', label: 'Background image URL', type: 'url' },
                    { key: 'logo_url',  label: 'Company logo URL',     type: 'url' },
                    { key: 'url',       label: 'Story URL',            type: 'url' },
                ],
            },
        ],
    },

    // ── stories_grid ──────────────────────────────────────────────
    {
        type: 'stories_grid', label: 'Stories Grid', icon: '/icons/event.svg',
        description: '2-col featured image cards + "All stories" editorial list rows.',
        group: 'newsroom',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'stories', blockType: 'customer_story_card', label: 'Stories',
                multiple: true, itemLabel: 'Story',
                fields: [
                    { key: 'company',      label: 'Company name',         type: 'text',    required: true },
                    { key: 'outcome',      label: 'Headline / outcome',   type: 'text',    required: true },
                    { key: 'quote',        label: 'Pull-quote',           type: 'textarea' },
                    { key: 'image_url',    label: 'Background image URL', type: 'url' },
                    { key: 'url',          label: 'Story URL',            type: 'url' },
                    { key: 'author_name',  label: 'Category tag',         type: 'text',    placeholder: 'User story' },
                    { key: 'author_title', label: 'Date',                 type: 'text',    placeholder: 'July 12, 2023' },
                ],
            },
            SINGLE_CTA_BLOCK,
        ],
    },

    // ── about_hero ────────────────────────────────────────────────
    {
        type: 'about_hero', label: 'About Hero', icon: '/icons/corporate_gifts.svg',
        description: 'Dark two-column mission hero for the About Us page.',
        group: 'newsroom',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK, RICH_TEXT_BLOCK,
            {
                key: 'media', blockType: 'media', label: 'Hero image (right column)', optional: true,
                fields: [
                    { key: 'url', label: 'Image URL', type: 'url' },
                    { key: 'alt', label: 'Alt text',  type: 'text' },
                ],
            },
            CTA_MULTI_BLOCK,
        ],
    },

    // ── mission_statement ─────────────────────────────────────────
    {
        type: 'mission_statement', label: 'Mission Statement', icon: '/icons/social.svg',
        description: 'Two-column: large gold-accented quote left, values list right.',
        group: 'newsroom',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK, RICH_TEXT_BLOCK,
            {
                key: 'values', blockType: 'feature_item', label: 'Core values',
                multiple: true, optional: true, itemLabel: 'Value',
                fields: [
                    { key: 'label',       label: 'Value title',       type: 'text',    required: true },
                    { key: 'description', label: 'Value description', type: 'textarea' },
                ],
            },
        ],
    },

    // ── timeline ──────────────────────────────────────────────────
    {
        type: 'timeline', label: 'Timeline', icon: '/icons/calendar.svg',
        description: 'Alternating vertical timeline of company milestones.',
        group: 'newsroom',
        blocks: [
            LABEL_BLOCK, HEADLINE_BLOCK, SUB_BLOCK,
            {
                key: 'events', blockType: 'timeline_event', label: 'Milestones',
                multiple: true, itemLabel: 'Milestone',
                fields: [
                    { key: 'year',        label: 'Year / date',     type: 'text',    required: true, placeholder: '2021' },
                    { key: 'title',       label: 'Milestone title', type: 'text',    required: true },
                    { key: 'description', label: 'Description',     type: 'textarea' },
                ],
            },
        ],
    },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export const SCHEMA_MAP: Record<string, SectionTypeSchema> =
    Object.fromEntries(SECTION_SCHEMAS.map(s => [s.type, s]));

export const GROUPS: { key: SectionTypeSchema['group']; label: string }[] = [
    { key: 'hero',       label: 'Hero & CTA' },
    { key: 'content',    label: 'Content' },
    { key: 'grid',       label: 'Grid & Cards' },
    { key: 'media',      label: 'Media' },
    { key: 'platform',   label: 'Platform' },
    { key: 'navigation', label: 'Navigation' },
    { key: 'legal',      label: 'Legal' },
    { key: 'newsroom',   label: 'Newsroom Hub' },
];
