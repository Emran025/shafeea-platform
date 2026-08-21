import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

export default function NavigationAnchorSection({ blocks }: Props) {
    const headline = blocks.find(b => b.type === 'headline');

    return (
        <div className="nav-anchor">
            <div className="nav-anchor__inner">
                {headline && (
                    <h3 className="nav-anchor__label">
                        {String((headline.fields as Record<string, unknown>)?.text ?? '')}
                    </h3>
                )}
            </div>
        </div>
    );
}
