import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import BlockGrid     from '../ui/BlockGrid';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

function UseCaseCardWrapper({ children }: { block: BlockPayload; children: React.ReactNode }) {
    return <div className="use-case-grid__card-wrapper">{children}</div>;
}

export default function UseCaseGridSection({ blocks }: Props) {
    const headline     = blocks.find(b => b.type === 'headline');
    const subheadline  = blocks.find(b => b.type === 'subheadline');
    const label        = blocks.find(b => b.type === 'label');
    const useCaseCards = blocks.filter(b => b.type === 'use_case_card');

    return (
        <div className="container">
            <SectionHeader
                label={label}
                headline={headline}
                richText={subheadline}
                align="center"
            />
            <BlockGrid
                blocks={useCaseCards}
                cols={useCaseCards.length >= 3 ? 3 : 2}
                Wrapper={UseCaseCardWrapper}
            />
        </div>
    );
}
