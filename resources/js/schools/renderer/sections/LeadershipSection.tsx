import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import { getDemoLeadershipPhoto } from '../../admin/lang/demoMedia';
import { SITE_LANG } from '../lang/en';
import { getTextField } from '../../utils/blockFields';

const L = SITE_LANG.leadership;

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

const cardVariant = {
    hidden:  { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45 } }),
};

export default function LeadershipSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const people   = blocks.filter(b => b.type === 'person_card');

    return (
        <div className="container">
            {(label || headline) && (
                <SectionHeader label={label} headline={headline} align="center" />
            )}
            {people.length > 0 && (
                <motion.div
                    className="leadership-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                >
                    {people.map((block, i) => {
                        const fields = (block.fields ?? {}) as Record<string, unknown>;
                        const name      = (fields.full_name as string)    ?? '';
                        const title     = (fields.title as string)        ?? '';
                        const dept      = (fields.department as string)   ?? '';
                        const bio       = (fields.bio_short as string)    ?? '';
                        const linkedin  = (fields.linkedin_url as string) ?? '';
                        const imgUrl    = (fields.image_url as string)    ?? getDemoLeadershipPhoto(i).url;

                        return (
                            <motion.div
                                key={block.id}
                                className="leadership-card"
                                variants={cardVariant}
                                custom={i}
                            >
                                <div className="leadership-card__photo-wrap">
                                    <img
                                        src={imgUrl}
                                        alt={name || 'Team member'}
                                        className="leadership-card__photo"
                                        loading="lazy"
                                    />
                                    <div className="leadership-card__photo-overlay" />
                                </div>
                                <div className="leadership-card__body">
                                    <h3 className="leadership-card__name">{name}</h3>
                                    {title && <p className="leadership-card__title">{title}</p>}
                                    {dept  && <p className="leadership-card__dept">{dept}</p>}
                                    {bio   && <p className="leadership-card__bio">{bio}</p>}
                                    {linkedin && (
                                        <a
                                            href={linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="leadership-card__linkedin"
                                        >
                                            {L.connectOnLinkedIn} →
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}
