import React from 'react';
import HeadlineBlock          from './HeadlineBlock';
import SubheadlineBlock       from './SubheadlineBlock';
import LabelBlock             from './LabelBlock';
import RichTextBlock          from './RichTextBlock';
import QuoteBlock             from './QuoteBlock';
import CtaBlock               from './CtaBlock';
import PlatformCardBlock      from './PlatformCardBlock';
import ProductGatewayCtaBlock from './ProductGatewayCtaBlock';
import PersonCardBlock        from './PersonCardBlock';
import FeatureItemBlock       from './FeatureItemBlock';
import StatItemBlock          from './StatItemBlock';
import MediaBlock             from './MediaBlock';
import MediaGroupBlock        from './MediaGroupBlock';
import FormDefinitionBlock    from './FormDefinitionBlock';
import UnknownBlock           from './UnknownBlock';
import CapabilityCardBlock    from './CapabilityCardBlock';
import UseCaseCardBlock        from './UseCaseCardBlock';
import IndustryCardBlock      from './IndustryCardBlock';
import PlatformRecommendationBlock from './PlatformRecommendationBlock';
import PricingTierCardBlock    from './PricingTierCardBlock';
import FeatureRowBlock         from './FeatureRowBlock';
import VideoEmbedBlock         from './VideoEmbedBlock';
import BreadcrumbTrailBlock    from './BreadcrumbTrailBlock';
import CustomerStoryCardBlock  from './CustomerStoryCardBlock';
import BlogPostCardBlock       from './BlogPostCardBlock';
import type { BlockPayload, RenderContext } from '../../types/engine';

/**
 * BlockRenderer — blocks/BlockRenderer
 * Canonical location is blocks/. The legacy blocks/BlockRenderer.tsx re-exports from here.
 * Dispatches a BlockPayload to its registered component via BLOCK_MAP.
 */

interface Props {
    block:    BlockPayload;
    context?: RenderContext;
}

type BlockComponent = React.ComponentType<{ block: BlockPayload; context: RenderContext }>;

const BLOCK_MAP: Record<string, BlockComponent> = {
    headline:                HeadlineBlock,
    subheadline:             SubheadlineBlock,
    label:                   LabelBlock,
    caption:                 LabelBlock,
    rich_text:               RichTextBlock,
    quote:                   QuoteBlock,
    cta:                     CtaBlock,
    nav_link:                UnknownBlock,
    platform_card:           PlatformCardBlock,
    product_gateway_cta:     ProductGatewayCtaBlock,
    person_card:             PersonCardBlock,
    feature_item:            FeatureItemBlock,
    stat_item:               StatItemBlock,
    media:                   MediaBlock,
    media_group:             MediaGroupBlock,
    form_definition:         FormDefinitionBlock,
    capability_card:         CapabilityCardBlock,
    use_case_card:           UseCaseCardBlock,
    industry_card:           IndustryCardBlock,
    platform_recommendation: PlatformRecommendationBlock,
    pricing_tier_card:       PricingTierCardBlock,
    feature_row:             FeatureRowBlock,
    video_embed:             VideoEmbedBlock,
    breadcrumb_trail:        BreadcrumbTrailBlock,
    customer_story_card:     CustomerStoryCardBlock,
    blog_post_card:          BlogPostCardBlock,
};

export default function BlockRenderer({ block, context = 'light' }: Props) {
    const Component: BlockComponent = BLOCK_MAP[block.type] ?? UnknownBlock;
    return <Component block={block} context={context} />;
}
