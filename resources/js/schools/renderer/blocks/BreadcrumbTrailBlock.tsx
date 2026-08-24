import React from 'react';
import { Link } from 'react-router-dom';
import type { BlockPayload, RenderContext, BreadcrumbTrailFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function BreadcrumbTrailBlock({ block }: Props) {
    const f           = block.fields as unknown as BreadcrumbTrailFields;
    const pathEntries = f?.path_entries ?? [];

    return (
        <nav className="breadcrumb-trail" aria-label="Breadcrumb">
            <ol className="breadcrumb-trail__list">
                {pathEntries.map((entry, i) => (
                    <li key={i} className="breadcrumb-trail__item">
                        {i > 0 && <span className="breadcrumb-trail__separator">/</span>}
                        {i === pathEntries.length - 1 ? (
                            <span className="breadcrumb-trail__current" aria-current="page">{entry.label}</span>
                        ) : (
                            <Link to={entry.url_path} className="breadcrumb-trail__link">{entry.label}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
