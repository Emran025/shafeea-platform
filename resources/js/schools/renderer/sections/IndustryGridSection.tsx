import React from 'react';
import SectionShell  from '../ui/SectionShell';
import SectionHeader from '../ui/SectionHeader';
import BlockGrid     from '../ui/BlockGrid';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

function IndustryCardWrapper({ children }: { block: BlockPayload; children: React.ReactNode }) {
    return <div className="industry-grid__card-wrapper">{children}</div>;
}

export default function IndustryGridSection({ blocks }: Props) {
    const headline      = blocks.find(b => b.type === 'headline');
    const subheadline   = blocks.find(b => b.type === 'subheadline');
    const label         = blocks.find(b => b.type === 'label');
    const industryCards = blocks.filter(b => b.type === 'industry_card');

    return (
        <SectionShell className="section--industry-grid">
            <SectionHeader
                label={label}
                headline={headline}
                richText={subheadline}
                align="center"
            />
            <BlockGrid
                blocks={industryCards}
                cols={industryCards.length >= 3 ? 3 : 2}
                Wrapper={IndustryCardWrapper}
            />
        </SectionShell>
    );
}
