import React from 'react';
import HeroSection              from './sections/HeroSection';
import NarrativeSection         from './sections/NarrativeSection';
import ValuePropositionSection  from './sections/ValuePropositionSection';
import PlatformShowcaseSection  from './sections/PlatformShowcaseSection';
import LeadershipSection        from './sections/LeadershipSection';
import StatisticsSection        from './sections/StatisticsSection';
import TestimonialSection       from './sections/TestimonialSection';
import CtaBandSection           from './sections/CtaBandSection';
import LegalBodySection         from './sections/LegalBodySection';
import ContactFormSection       from './sections/ContactFormSection';
import NavigationAnchorSection  from './sections/NavigationAnchorSection';
import FreeformSection          from './sections/FreeformSection';
import UnknownSection           from './sections/UnknownSection';
// Phase 1 — new section types (existing files)
import ProblemStatementSection  from './sections/ProblemStatementSection';
import SolutionOverviewSection  from './sections/SolutionOverviewSection';
import CapabilityGridSection    from './sections/CapabilityGridSection';
import EcosystemDiagramSection  from './sections/EcosystemDiagramSection';
import UseCaseGridSection       from './sections/UseCaseGridSection';
import IndustryGridSection      from './sections/IndustryGridSection';
import PricingCardRowSection    from './sections/PricingCardRowSection';
// Phase 1 — new section types (newly created)
import BreadcrumbSection        from './sections/BreadcrumbSection';
import InPageNavSection         from './sections/InPageNavSection';
import CustomerStoryGridSection from './sections/CustomerStoryGridSection';
import BlogPostGridSection      from './sections/BlogPostGridSection';
import PricingTableSection      from './sections/PricingTableSection';
// Phase 2 — media-rich section types
import MediaSpotlightSection    from './sections/MediaSpotlightSection';
import MediaBannerSection       from './sections/MediaBannerSection';
import VideoFeatureSection      from './sections/VideoFeatureSection';
import MediaGridSection         from './sections/MediaGridSection';
// Enterprise Extension section types
import LogoCloudSection         from './sections/LogoCloudSection';
import FaqAccordionSection      from './sections/FaqAccordionSection';
import TabbedSwitcherSection    from './sections/TabbedSwitcherSection';
import ResourceGateSection      from './sections/ResourceGateSection';
import ProductComparisonSection from './sections/ProductComparisonSection';
// Newsroom Hub section types
import NewsHeroSection          from './sections/NewsHeroSection';
import NewsArticleGridSection   from './sections/NewsArticleGridSection';
import StoriesHeroSection       from './sections/StoriesHeroSection';
import StoriesGridSection       from './sections/StoriesGridSection';
import AboutHeroSection         from './sections/AboutHeroSection';
import MissionStatementSection  from './sections/MissionStatementSection';
import TimelineSection          from './sections/TimelineSection';
// T003 — new interactive sections
import SolutionPickerSection    from './sections/SolutionPickerSection';
import TabbedPricingSection     from './sections/TabbedPricingSection';
import FeatureGridSection       from './sections/FeatureGridSection';
import WorkflowStepsSection     from './sections/WorkflowStepsSection';
import ComparisonTableSection   from './sections/ComparisonTableSection';
// Newsletter
import NewsletterBanner         from './sections/NewsletterBanner';
import NewsArticleDetailSection from './sections/NewsArticleDetailSection';
import StoryDetailSection       from './sections/StoryDetailSection';
import type { SectionPayload, PageCore } from '../types/engine';
import type { SectionBackground } from './PageRenderer';

interface Props {
    section:    SectionPayload;
    page:       PageCore;
    background: SectionBackground;
}

type SectionComponent = React.ComponentType<{
    section: SectionPayload;
    blocks:  SectionPayload['blocks'];
    page:    PageCore;
}>;

const SECTION_MAP: Record<string, SectionComponent> = {
    // Original section types
    hero:                HeroSection,
    narrative:           NarrativeSection,
    value_proposition:   ValuePropositionSection,
    platform_showcase:   PlatformShowcaseSection,
    leadership:          LeadershipSection,
    statistics:          StatisticsSection,
    testimonial:         TestimonialSection,
    cta_band:            CtaBandSection,
    legal_body:          LegalBodySection,
    contact_form:        ContactFormSection,
    navigation_anchor:   NavigationAnchorSection,
    freeform:            FreeformSection,
    // Phase 1 — platform.full_page section types
    problem_statement:   ProblemStatementSection,
    solution_overview:   SolutionOverviewSection,
    capability_grid:     CapabilityGridSection,
    ecosystem_diagram:   EcosystemDiagramSection,
    use_case_grid:       UseCaseGridSection,
    industry_grid:       IndustryGridSection,
    pricing_card_row:    PricingCardRowSection,
    // Phase 1 — navigation & content discovery
    breadcrumb:          BreadcrumbSection,
    in_page_nav:         InPageNavSection,
    customer_story_grid: CustomerStoryGridSection,
    blog_post_grid:      BlogPostGridSection,
    pricing_table:       PricingTableSection,
    // Phase 2 — media-rich layouts
    media_spotlight:     MediaSpotlightSection,
    media_banner:        MediaBannerSection,
    video_feature:       VideoFeatureSection,
    media_grid:          MediaGridSection,
    // Enterprise Extensions
    logo_cloud:          LogoCloudSection,
    faq_accordion:       FaqAccordionSection,
    tabbed_switcher:     TabbedSwitcherSection,
    resource_gate:       ResourceGateSection,
    product_comparison:  ProductComparisonSection,
    // Newsroom Hub
    news_hero:           NewsHeroSection,
    news_article_grid:   NewsArticleGridSection,
    stories_hero:        StoriesHeroSection,
    stories_grid:        StoriesGridSection,
    about_hero:          AboutHeroSection,
    mission_statement:   MissionStatementSection,
    timeline:            TimelineSection,
    // T003
    solution_picker:       SolutionPickerSection,
    tabbed_pricing:        TabbedPricingSection,
    feature_grid:          FeatureGridSection,
    workflow_steps:        WorkflowStepsSection,
    comparison_table:      ComparisonTableSection,
    // Newsletter & detail pages
    newsletter_banner:     NewsletterBanner,
    news_article_detail:   NewsArticleDetailSection,
    story_detail:          StoryDetailSection,
};

/*
 * SELF_CONTAINED sections manage their own full-bleed background, padding,
 * and layout entirely. The outer wrapper must be a bare transparent element
 * so the component renders edge-to-edge without a coloured strip around it.
 */
const SELF_CONTAINED = new Set(['hero', 'media_banner']);

/*
 * FIXED_BG sections always get a specific background regardless of the
 * alternating white/surface cycle (e.g. gradient or solid navy).
 * The component root must NOT add its own `section` padding class.
 */
const FIXED_BG: Record<string, string> = {
    cta_band:   'navy-grad',
    statistics: 'navy',
};

export default function SectionRenderer({ section, page, background }: Props) {
    const Component   = SECTION_MAP[section.type] ?? UnknownSection;
    const anchorProps = section.anchor_id ? { id: section.anchor_id } : {};

    const bgImageUrl    = section.background_image_url;
    const customClasses = section.custom_css_classes;

    if (SELF_CONTAINED.has(section.type)) {
        if (bgImageUrl) {
            const extraClasses = customClasses ? ` ${customClasses}` : '';
            return (
                <div
                    {...anchorProps}
                    className={`section--image-bg${extraClasses}`}
                    style={{ backgroundImage: `url(${bgImageUrl})` }}
                >
                    <div className="section__image-overlay" aria-hidden="true" />
                    <div className="section__image-content">
                        <Component
                            section={section}
                            blocks={section.blocks ?? []}
                            page={page}
                        />
                    </div>
                </div>
            );
        }
        const extraClasses = customClasses ? ` ${customClasses}` : '';
        return (
            <div {...anchorProps} className={extraClasses.trim() || undefined}>
                <Component
                    section={section}
                    blocks={section.blocks ?? []}
                    page={page}
                />
            </div>
        );
    }

    const bg = FIXED_BG[section.type] ?? background;

    if (bgImageUrl) {
        /*
         * When a background image is set the outer wrapper switches to a
         * position:relative container with a full-bleed cover image and a
         * semi-transparent dark overlay so text stays legible.
         */
        const extraClasses = customClasses ? ` ${customClasses}` : '';
        return (
            <section
                {...anchorProps}
                className={`section section--image-bg${extraClasses}`}
                style={{ backgroundImage: `url(${bgImageUrl})` }}
            >
                <div className="section__image-overlay" aria-hidden="true" />
                <div className="section__image-content">
                    <Component
                        section={section}
                        blocks={section.blocks ?? []}
                        page={page}
                    />
                </div>
            </section>
        );
    }

    /*
     * Outer wrapper supplies background + padding via `section section--{bg}`.
     * Components must NOT add their own `section section--*` wrapper —
     * they should only contain layout (container, grid) elements.
     */
    const extraClasses = customClasses ? ` ${customClasses}` : '';
    return (
        <section
            {...anchorProps}
            className={`section section--${bg}${extraClasses}`}
        >
            <Component
                section={section}
                blocks={section.blocks ?? []}
                page={page}
            />
        </section>
    );
}
