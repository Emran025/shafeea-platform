import { motion } from 'framer-motion';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import SectionHeader from '../ui/SectionHeader';
import BlockGrid     from '../ui/BlockGrid';
import CtaRow        from '../ui/CtaRow';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

export default function PlatformShowcaseSection({ blocks }: Props) {
    const label         = blocks.find(b => b.type === 'label');
    const headline      = blocks.find(b => b.type === 'headline');
    const richText      = blocks.find(b => b.type === 'rich_text');
    const ctas          = blocks.filter(b => b.type === 'cta');
    const platformCards = blocks.filter(b => b.type === 'platform_card');

    return (
        <section className="showcase">
            <div className="showcase__bg-top" />
            <div className="showcase__bg-orb-left" />
            <div className="showcase__bg-orb-right" />

            <div className="showcase__inner">
                {(label || headline || richText) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.7 }}
                    >
                        <SectionHeader
                            label={label}
                            headline={headline}
                            richText={richText}
                            align="center"
                        />
                    </motion.div>
                )}

                {platformCards.length > 0 && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={{
                            hidden:  { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
                        }}
                    >
                        <BlockGrid
                            blocks={platformCards}
                            cols={platformCards.length >= 3 ? 3 : (platformCards.length as 2 | 3)}
                        />
                    </motion.div>
                )}

                {ctas.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="showcase__ctas"
                    >
                        <CtaRow blocks={ctas} justify="center" />
                    </motion.div>
                )}
            </div>
        </section>
    );
}

