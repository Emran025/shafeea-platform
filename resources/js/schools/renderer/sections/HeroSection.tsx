import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import LabelPill     from '../ui/LabelPill';
import type { SectionPayload, BlockPayload, PageCore, CtaFields } from '../../types/engine';
import { getTextField } from '../../utils/blockFields';
import { resolveHref }  from '../../utils/resolveHref';
import BlockRenderer from '../blocks/BlockRenderer';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

export default function HeroSection({ blocks }: Props) {
    const headline    = blocks.find(b => b.type === 'headline');
    const subheadline = blocks.find(b => b.type === 'subheadline');
    const label       = blocks.find(b => b.type === 'label');
    const ctas        = blocks.filter(b => b.type === 'cta');
    const media       = blocks.find(b => b.type === 'media');
    const richText    = blocks.find(b => b.type === 'rich_text');

    return (
        <section className="hero">
            <div className="hero__bg-radial" />
            <div className="hero__bg-orb-top" />
            <div className="hero__bg-orb-bottom" />
            <div className="hero__bg-grid" />

            <div className="hero__inner">
                <div className={`hero__grid${media ? ' hero__grid--with-media' : ''}`}>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="hero__content"
                    >
                        {label && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <LabelPill text={getTextField(label, 'text')} variant="dark" />
                            </motion.div>
                        )}

                        {headline && (
                            <h1 className="hero__headline">
                                {getTextField(headline, 'text')}
                            </h1>
                        )}

                        {subheadline && (
                            <p className="hero__sub">
                                {getTextField(subheadline, 'text')}
                            </p>
                        )}

                        {richText && (
                            <div className="prose-accsystem prose-accsystem--dark">
                                <BlockRenderer block={richText} context="dark" />
                            </div>
                        )}

                        {ctas.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="hero__ctas"
                            >
                                {ctas.map((block, i) => {
                                    const f = block.fields as unknown as CtaFields;
                                    return (
                                        <a
                                            key={block.id}
                                            href={resolveHref(f?.destination)}
                                            target={f?.open_in_new_tab ? '_blank' : undefined}
                                            rel={f?.open_in_new_tab ? 'noopener noreferrer' : undefined}
                                            className={`hero-cta ${i === 0 ? 'hero-cta--primary' : 'hero-cta--secondary'}`}
                                        >
                                            {f?.label ?? ''}
                                            {i === 0 && <ChevronRight className="hero-cta__icon" />}
                                        </a>
                                    );
                                })}
                            </motion.div>
                        )}
                    </motion.div>

                    {media && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="hero__media"
                        >
                            <div className="hero__media-glow" />
                            <div className="hero__media-frame">
                                <BlockRenderer block={media} context="dark" />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="hero__accent-bar" />
        </section>
    );
}
