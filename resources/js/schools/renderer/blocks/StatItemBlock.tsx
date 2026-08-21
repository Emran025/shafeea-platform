import React from 'react';
import type { BlockPayload, RenderContext, StatItemFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function StatItemBlock({ block, context = 'light' }: Props) {
    const f    = block.fields as StatItemFields;
    const dark = context === 'dark';

    return (
        <div className="stat-item">
            <div className="stat-item__value">
                {f?.value}
                {f?.unit && (
                    <span className={`stat-item__unit${dark ? '' : ' stat-item__unit--light'}`}>
                        {f.unit}
                    </span>
                )}
            </div>
            {f?.descriptor && (
                <p className={`stat-item__descriptor${dark ? '' : ' stat-item__descriptor--light'}`}>
                    {f.descriptor}
                </p>
            )}
        </div>
    );
}
