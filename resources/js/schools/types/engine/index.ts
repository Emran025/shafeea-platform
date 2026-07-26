/**
 * ACCSYSTEM Engine — Public Type Index
 * Re-exports all engine types from their focused sub-modules.
 * Import from 'types/engine' resolves here via TypeScript's index convention.
 */

export type {
    RenderContext,
    DisplayCase,
    SiteStatus,
    DestinationType,
    ContractType,
    ColorTokens,
    Destination,
    MediaVariant,
    MediaPayload,
    ActionPayload,
    BlockConfig,
} from './primitives';

export type {
    BlockType,
    HeadlineFields,
    SubheadlineFields,
    LabelFields,
    QuoteFields,
    CtaFields,
    FeatureItemFields,
    StatItemFields,
    PersonCardFields,
    FormDefinitionFields,
    RichTextMark,
    RichTextNode,
    RichTextFields,
    PlatformCardFields,
    CapabilityCardFields,
    UseCaseCardFields,
    IndustryCardFields,
    PlatformRecommendationFields,
    PricingTierCardFields,
    FeatureRowFields,
    VideoEmbedFields,
    BreadcrumbTrailFields,
    CustomerStoryCardFields,
    BlogPostCardFields,
    BlockFields,
    BlockPayload,
} from './blocks';

export type {
    SectionType,
    SectionPayload,
} from './sections';

export type {
    NavEntry,
    Navigation,
} from './navigation';

export type {
    HreflangEntry,
    PageMeta,
    PageCore,
    CompositionWarning,
    PagePayload,
} from './page';

export type {
    ErrorPayload,
    PageContract,
    ErrorContract,
    ContractEnvelope,
} from './contracts';

export { isPageContract, isErrorContract } from './contracts';
