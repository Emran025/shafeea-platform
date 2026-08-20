import React from 'react';
import ActionRenderer from './ActionRenderer';
import type { BlockPayload, RenderContext, UseCaseCardFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function UseCaseCardBlock({ block, context = 'light' }: Props) {
    const f    = block.fields as unknown as UseCaseCardFields;
    const { headline = '', scenario_narrative = '', tags = [] } = f ?? {};
    const dark = context === 'dark';

    return (
        <div className={`use-case-card${dark ? ' use-case-card--dark' : ''}`}>
            {tags.length > 0 && (
                <div className="use-case-card__tags">
                    {tags.map((tag, i) => (
                        <span key={i} className="use-case-card__tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <h3 className="use-case-card__title">{headline}</h3>
            <p className="use-case-card__desc">{scenario_narrative}</p>
            {block.actions && block.actions.length > 0 && (
                <div className="use-case-card__actions">
                    <ActionRenderer actions={block.actions} variant={dark ? 'white' : 'primary'} />
                </div>
            )}
        </div>
    );
}
