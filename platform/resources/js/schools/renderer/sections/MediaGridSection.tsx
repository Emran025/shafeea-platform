import { motion } from 'framer-motion';
import LabelPill from '../ui/LabelPill';
import { getTextField } from '../../utils/blockFields';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

function extractStr(val: unknown): string {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        return (obj.en as string) || (obj.ar as string) || (Object.values(obj)[0] as string) || '';
    }
    return '';
}

function getMediaAsset(block: BlockPayload): { src: string; isVideo: boolean; altText: string; caption: string | null } | null {
    const f = (block.fields ?? {}) as Record<string, unknown>;
    const c = (block.content ?? {}) as Record<string, unknown>;

    // 1. Database attachment
    if (block.media) {
        const variant = block.media.variants?.find(
            v => (v as unknown as Record<string, unknown>)['label'] === 'original'
        ) ?? block.media.variants?.[0];
        if (variant?.url) {
            return {
                src: variant.url,
                isVideo: block.media.type === 'video',
                altText: block.media.alt_text || extractStr(f.alt || c.alt),
                caption: block.media.caption || extractStr(f.caption || c.caption) || null,
            };
        }
    }

    // 2. Inline fields or content properties
    const src = extractStr(f.image_url || f.url || f.src || f.image || c.image_url || c.url || c.src || c.image);
    if (src) {
        const isVideo = src.endsWith('.mp4') || src.endsWith('.webm') || src.includes('video');
        return {
            src,
            isVideo,
            altText: extractStr(f.alt || c.alt) || 'Campus gallery image',
            caption: extractStr(f.caption || c.caption) || null,
        };
    }

    return null;
}

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
                        const asset = getMediaAsset(block);
                        if (!asset) return null;

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
                                    {asset.isVideo ? (
                                        <video
                                            src={asset.src}
                                            controls
                                            aria-label={asset.altText}
                                        />
                                    ) : (
                                        <img
                                            src={asset.src}
                                            alt={asset.altText}
                                            loading="lazy"
                                        />
                                    )}
                                </div>
                                {asset.caption && (
                                    <p className="media-grid__caption">{asset.caption}</p>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}
