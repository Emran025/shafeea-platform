import { motion } from 'framer-motion';
import BlockRenderer from '../blocks/BlockRenderer';
import LabelPill from '../ui/LabelPill';
import { getTextField } from '../../utils/blockFields';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

/**
 * MediaSpotlightSection — media_spotlight
 * Side-by-side layout: rich text content on one side, image or video on the other.
 * Layout direction is controlled by section.group:
 *   "media-right" (default) — content left, media right
 *   "media-left"            — media left, content right
 */
export default function MediaSpotlightSection({ section, blocks }: Props) {
    const label       = blocks.find(b => b.type === 'label');
    const headline    = blocks.find(b => b.type === 'headline');
    const subheadline = blocks.find(b => b.type === 'subheadline');
    const richText    = blocks.find(b => b.type === 'rich_text');
    const ctas        = blocks.filter(b => b.type === 'cta');
    const mediaBlock  = blocks.find(b => b.type === 'media' || b.type === 'video_embed');

    const reversed = section.group === 'media-left';

    return (
        <div className="container">
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className={`media-spotlight__grid${reversed ? ' media-spotlight__grid--reverse' : ''}`}
            >
                <div className="media-spotlight__content">
                    {label && (
                        <LabelPill text={getTextField(label, 'text')} variant="light" />
                    )}
                    {headline && (
                        <h2 className="media-spotlight__headline">
                            {getTextField(headline, 'text')}
                        </h2>
                    )}
                    {subheadline && (
                        <p className="media-spotlight__body">
                            {getTextField(subheadline, 'text')}
                        </p>
                    )}
                    {richText && (
                        <div className="prose-accsystem">
                            <BlockRenderer block={richText} />
                        </div>
                    )}
                    {ctas.length > 0 && (
                        <div className="media-spotlight__ctas">
                            {ctas.map(b => <BlockRenderer key={b.id} block={b} />)}
                        </div>
                    )}
                </div>

                {mediaBlock && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="media-spotlight__media"
                    >
                        <div className="media-spotlight__frame">
                            <BlockRenderer block={mediaBlock} />
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
