import React from 'react';
import type { BlockPayload, RenderContext, FeatureRowFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function FeatureRowBlock({ block }: Props) {
    const f = block.fields as unknown as FeatureRowFields;
    const { feature_name = '', tier_values = {} } = f ?? {};

    return (
        <tr className="feature-row">
            <td className="feature-row__name">{feature_name}</td>
            <td className="feature-row__val">{tier_values.starter ?? tier_values.Starter ?? '—'}</td>
            <td className="feature-row__val">{tier_values.growth ?? tier_values.Growth ?? '—'}</td>
            <td className="feature-row__val">{tier_values.enterprise ?? tier_values.Enterprise ?? '—'}</td>
        </tr>
    );
}
