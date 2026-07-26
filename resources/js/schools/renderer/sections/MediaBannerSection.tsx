import { motion } from 'framer-motion';
import BlockRenderer from '../blocks/BlockRenderer';
import LabelPill from '../ui/LabelPill';
import { getTextField } from '../../utils/blockFields';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

function getMediaSrc(block: BlockPayload): { src: string; isVideo: boolean } | null {
    if (!block.media) return null;
    const variant = block.media.variants?.find(
        v => (v as unknown as Record<string, unknown>)['label'] === 'original'
    ) ?? block.media.variants?.[0];
    if (!variant?.url) return null;
    return { src: variant.url, isVideo: block.media.type === 'video' };
}

/**
 * MediaBannerSection — media_banner
 * Full-bleed section with a background image or video, a darkening overlay,
 * and a content block (label + headline + subheadline + CTAs) rendered on top.
 * section.group === 'center' centres the content block.
 */
export default function MediaBannerSection({ section, blocks }: Props) {
    const label       = blocks.find(b => b.type === 'label');
    const headline    = blocks.find(b => b.type === 'headline');
    const subheadline = blocks.find(b => b.type === 'subheadline');
    const ctas        = blocks.filter(b => b.type === 'cta');
    const mediaBlock  = blocks.find(b => b.type === 'media');

    const bg       = mediaBlock ? getMediaSrc(mediaBlock) : null;
    const centered = section.group === 'center';

    return (
        <div className="media-banner">
            {bg && (
                bg.isVideo ? (
                    <video
                        className="media-banner__bg-video"
                        src={bg.src}
                        autoPlay muted loop playsInline
                        aria-hidden="true"
                    />
                ) : (
                    <img
                        className="media-banner__bg"
                        src={bg.src}
                        alt=""
                        aria-hidden="true"
                    />
                )
            )}
            <div className="media-banner__overlay" />

            <div className="media-banner__inner">
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7 }}
                    className={`media-banner__content${centered ? ' media-banner__content--center' : ''}`}
                >
                    {label && (
                        <LabelPill text={getTextField(label, 'text')} variant="dark" />
                    )}
                    {headline && (
                        <h2 className="media-banner__headline">
                            {getTextField(headline, 'text')}
                        </h2>
                    )}
                    {subheadline && (
                        <p className="media-banner__sub">
                            {getTextField(subheadline, 'text')}
                        </p>
                    )}
                    {ctas.length > 0 && (
                        <div className={`media-banner__ctas${centered ? ' media-banner__ctas--center' : ''}`}>
                            {ctas.map(b => <BlockRenderer key={b.id} block={b} context="dark" />)}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
