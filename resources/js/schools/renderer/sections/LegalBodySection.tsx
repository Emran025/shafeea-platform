import React from 'react';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import BlockRenderer from '../blocks/BlockRenderer';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

export default function LegalBodySection({ blocks }: Props) {
    const sorted = [...blocks].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    return (
        <div className="legal-body">
            <div className="legal-body__inner">
                {sorted.map(b => (
                    <div
                        key={b.id}
                        className={`legal-body__block${b.type === 'headline' ? ' legal-body__block--headline' : ''}`}
                    >
                        <BlockRenderer block={b} />
                    </div>
                ))}
            </div>
        </div>
    );
}
