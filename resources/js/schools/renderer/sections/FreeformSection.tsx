import BlockRenderer from '../blocks/BlockRenderer';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

export default function FreeformSection({ blocks }: Props) {
    const sorted = [...blocks].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    return (
        <div className="freeform">
            <div className="freeform__inner">
                {sorted.map(b => (
                    <div key={b.id}>
                        <BlockRenderer block={b} />
                    </div>
                ))}
            </div>
        </div>
    );
}
