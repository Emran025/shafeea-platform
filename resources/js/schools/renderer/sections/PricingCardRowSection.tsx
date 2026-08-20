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

function PricingTierCardWrapper({ children }: { block: BlockPayload; children: React.ReactNode }) {
    return <div className="pricing-card-row__card-wrapper">{children}</div>;
}

export default function PricingCardRowSection({ blocks }: Props) {
    const headline         = blocks.find(b => b.type === 'headline');
    const subheadline      = blocks.find(b => b.type === 'subheadline');
    const label            = blocks.find(b => b.type === 'label');
    const pricingTierCards = blocks.filter(b => b.type === 'pricing_tier_card');

    return (
        <SectionShell background="surface" className="section--pricing-card-row">
            <SectionHeader
                label={label}
                headline={headline}
                richText={subheadline}
                align="center"
            />
            <BlockGrid
                blocks={pricingTierCards}
                cols={pricingTierCards.length >= 3 ? 3 : 2}
                Wrapper={PricingTierCardWrapper}
            />
        </SectionShell>
    );
}
