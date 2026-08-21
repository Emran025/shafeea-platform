import { Link } from 'react-router-dom';
import type { SectionPayload, BlockPayload, PageCore, BreadcrumbTrailFields } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

/**
 * BreadcrumbSection — renders a breadcrumb navigation trail.
 * Looks for a breadcrumb_trail block first; falls back to page.breadcrumb_path
 * injected via PageRenderer if available.
 */
export default function BreadcrumbSection({ blocks, page }: Props) {
    const trailBlock = blocks.find(b => b.type === 'breadcrumb_trail');

    // Source 1: explicit breadcrumb_trail block
    const entries: { label: string; url_path: string }[] = trailBlock
        ? ((trailBlock.fields as unknown as BreadcrumbTrailFields)?.path_entries ?? [])
        : [];

    // Source 2: page.breadcrumb_path injected by PageRenderer (if block absent)
    const path = (page as unknown as { breadcrumb_path?: { slug: string; label: string }[] }).breadcrumb_path ?? [];
    const pathEntries = entries.length > 0 ? entries : path.map(p => ({
        label:    p.label,
        url_path: p.slug === 'home' ? '/' : `/${p.slug}`,
    }));

    if (pathEntries.length <= 1) return null;

    return (
        <div className="breadcrumb-section">
            <div className="container">
                <nav className="breadcrumb-trail" aria-label="Breadcrumb">
                    <ol className="breadcrumb-trail__list">
                        {pathEntries.map((entry, i) => (
                            <li key={i} className="breadcrumb-trail__item">
                                {i > 0 && <span className="breadcrumb-trail__separator" aria-hidden>/</span>}
                                {i === pathEntries.length - 1 ? (
                                    <span className="breadcrumb-trail__current" aria-current="page">
                                        {entry.label}
                                    </span>
                                ) : (
                                    <Link to={entry.url_path} className="breadcrumb-trail__link">
                                        {entry.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
        </div>
    );
}
