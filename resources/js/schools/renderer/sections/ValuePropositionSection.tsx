import React from 'react';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import SectionHeader from '../ui/SectionHeader';
import BlockGrid     from '../ui/BlockGrid';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

/** Card shell wrapping each feature-item block */
function ValuePropCard({ children }: { block: BlockPayload; children: React.ReactNode }) {
    return <div className="value-prop__card">{children}</div>;
}

export default function ValuePropositionSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const features = blocks.filter(b => b.type === 'feature_item');
    const richText = blocks.find(b => b.type === 'rich_text');

    return (
        <div className="container">
            <SectionHeader
                label={label}
                headline={headline}
                richText={richText}
                align="center"
            />
            <BlockGrid
                blocks={features}
                cols={features.length >= 3 ? 3 : (features.length as 2 | 3) || 2}
                Wrapper={ValuePropCard}
            />
        </div>
    );
}

