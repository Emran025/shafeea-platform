import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import { getTextField } from '../../utils/blockFields';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

export default function WorkflowStepsSection({ blocks }: Props) {
    const label       = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const subheadline = blocks.find(b => b.type === 'subheadline') || blocks.find(b => b.type === 'rich_text');
    const steps       = blocks.filter(b => b.type === 'step_item');

    // Sort steps by position to guarantee logical ordering
    const sortedSteps = [...steps].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    return (
        <div className="container">
            <SectionHeader
                label={label}
                headline={headline}
                richText={subheadline}
                align="center"
            />

            {sortedSteps.length > 0 && (
                <div className="workflow-steps__grid">
                    {sortedSteps.map((step, idx) => {
                        const rawStepNum = getTextField(step, 'step_number');
                        const parsedNum = parseInt(rawStepNum, 10);
                        const displayNum = !isNaN(parsedNum)
                            ? (parsedNum < 10 ? `0${parsedNum}` : String(parsedNum))
                            : (rawStepNum || `0${idx + 1}`);

                        const title = getTextField(step, 'label');
                        const description = getTextField(step, 'description');

                        return (
                            <motion.div
                                key={step.id}
                                className="workflow-steps__card"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <div className="workflow-steps__number-wrapper">
                                    <span className="workflow-steps__number">{displayNum}</span>
                                    {idx < sortedSteps.length - 1 && (
                                        <div className="workflow-steps__connector-line" />
                                    )}
                                </div>
                                <h3 className="workflow-steps__title">{title}</h3>
                                <p className="workflow-steps__desc">{description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
