import BlockRenderer from '../blocks/BlockRenderer';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import SectionShell from '../ui/SectionShell';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

export default function NarrativeSection({ blocks }: Props) {
    const label  = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const media  = blocks.find(b => b.type === 'media');
    const others = blocks.filter(b => !['label', 'headline', 'media'].includes(b.type));

    return (
        <SectionShell className="section--narrative">
            <div className={`narrative__grid${media ? ' narrative__grid--with-media' : ''}`}>
                <div className="narrative__body">
                    {label    && <BlockRenderer block={label} />}
                    {headline && <BlockRenderer block={headline} />}
                    {others.map(b => <BlockRenderer key={b.id} block={b} />)}
                </div>
                {media && (
                    <div className="narrative__media"><BlockRenderer block={media} /></div>
                )}
            </div>
        </SectionShell>
    );
}
