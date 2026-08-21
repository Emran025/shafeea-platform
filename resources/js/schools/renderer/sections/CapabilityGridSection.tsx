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

function CapabilityCardWrapper({ children }: { block: BlockPayload; children: React.ReactNode }) {
    return <div className="capability-grid__card-wrapper">{children}</div>;
}

export default function CapabilityGridSection({ blocks }: Props) {
    const headline        = blocks.find(b => b.type === 'headline');
    const subheadline     = blocks.find(b => b.type === 'subheadline');
    const label           = blocks.find(b => b.type === 'label');
    const capabilityCards = blocks.filter(b => b.type === 'capability_card');

    return (
        <SectionShell className="section--capability-grid">
            <SectionHeader
                label={label}
                headline={headline}
                richText={subheadline}
                align="center"
            />
            <BlockGrid
                blocks={capabilityCards}
                cols={capabilityCards.length >= 3 ? 3 : 2}
                Wrapper={CapabilityCardWrapper}
            />
        </SectionShell>
    );
}
