import { motion } from 'framer-motion';
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
 * MediaGridSection — media_grid
 * Responsive grid of images and/or videos with optional per-item captions.
 * Layout adapts: 3-col on desktop, 2-col on tablet, 1-col on mobile.
 * Add a label + headline block for an optional section header.
 */
export default function MediaGridSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const items    = blocks.filter(b => b.type === 'media' || b.type === 'media_group');

    return (
        <div className="container media-grid">
            <div className="container">
                {(label || headline) && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="section-header section-header--center"
                    >
                        {label && <LabelPill text={getTextField(label, 'text')} variant="light" />}
                        {headline && (
                            <h2 className="block-headline">
                                {getTextField(headline, 'text')}
                            </h2>
                        )}
                    </motion.div>
                )}

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={{
                        hidden:  {},
                        visible: { transition: { staggerChildren: 0.09 } },
                    }}
                    className="media-grid__items"
                >
                    {items.map(block => {
                        const asset    = getMediaSrc(block);
                        const altText  = block.media?.alt_text ?? '';
                        const caption  = block.media?.caption ?? null;

                        return (
                            <motion.div
                                key={block.id}
                                variants={{
                                    hidden:  { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                                }}
                                className="media-grid__item"
                            >
                                <div className="media-grid__frame">
                                    {asset && (
                                        asset.isVideo ? (
                                            <video
                                                src={asset.src}
                                                controls
                                                aria-label={altText}
                                            />
                                        ) : (
                                            <img
                                                src={asset.src}
                                                alt={altText}
                                                loading="lazy"
                                            />
                                        )
                                    )}
                                </div>
                                {caption && (
                                    <p className="media-grid__caption">{caption}</p>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}
