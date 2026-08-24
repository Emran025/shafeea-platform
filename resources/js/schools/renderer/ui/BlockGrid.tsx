import React from 'react';
import type { BlockPayload, RenderContext } from '../../types/engine';
import BlockRenderer from '../blocks/BlockRenderer';

/**
 * BlockGrid
 * Renders an array of BlockPayloads in a responsive CSS grid.
 * Replaces the repetitive `<div className="grid-auto-N">{blocks.map(...)}</div>`
 * pattern across PlatformShowcaseSection, ValuePropositionSection, etc.
 *
 * CSS: layout.css → .grid-auto-2, .grid-auto-3, .grid-auto-4
 */

interface WrapperProps {
    block:    BlockPayload;
    children: React.ReactNode;
}

interface Props {
    blocks:   BlockPayload[];
    cols?:    2 | 3 | 4 | 'auto';
    context?: RenderContext;
    /** Optional wrapper rendered around each block (e.g. a card shell) */
    Wrapper?: React.ComponentType<WrapperProps>;
}

function resolveColumns(blocks: BlockPayload[], cols: Props['cols']): 2 | 3 | 4 {
    if (cols && cols !== 'auto') return cols;
    if (blocks.length >= 4) return 4;
    if (blocks.length === 3) return 3;
    return 2;
}

export default function BlockGrid({ blocks, cols = 'auto', context = 'light', Wrapper }: Props) {
    if (!blocks.length) return null;
    const columns = resolveColumns(blocks, cols);

    return (
        <div className={`grid-auto-${columns}`}>
            {blocks.map(block =>
                Wrapper ? (
                    <Wrapper key={block.id} block={block}>
                        <BlockRenderer block={block} context={context} />
                    </Wrapper>
                ) : (
                    <BlockRenderer key={block.id} block={block} context={context} />
                )
            )}
        </div>
    );
}
