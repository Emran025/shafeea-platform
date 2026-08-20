import React from 'react';
import ActionRenderer from './ActionRenderer';
import type { BlockPayload, RenderContext } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

function extractStr(val: unknown): string {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        return (obj.en as string) || (obj.ar as string) || (Object.values(obj)[0] as string) || '';
    }
    return '';
}

export default function BlogPostCardBlock({ block }: Props) {
    const f = (block.fields ?? {}) as Record<string, unknown>;
    const c = (block.content ?? {}) as Record<string, unknown>;

    const title    = extractStr(f.title || c.title);
    const category = extractStr(f.category || c.category);
    const summary  = extractStr(f.summary || f.outcome || c.summary || c.outcome);
    const author   = extractStr(f.author || f.author_name || c.author || c.author_name);
    const date     = extractStr(f.date || f.author_title || c.date || c.author_title);
    const imageUrl = extractStr(f.image_url || f.image || c.image_url || c.image);

    return (
        <div className="blog-post-card">
            {imageUrl && (
                <div className="blog-post-card__image-wrap">
                    <img src={imageUrl} alt={title || 'Article image'} className="blog-post-card__image" loading="lazy" />
                </div>
            )}
            <div className="blog-post-card__body">
                {category && <span className="blog-post-card__category">{category}</span>}
                {title && <h3 className="blog-post-card__title">{title}</h3>}
                {summary && <p className="blog-post-card__summary">{summary}</p>}
                {(author || date) && (
                    <div className="blog-post-card__meta">
                        {author && <span className="blog-post-card__author">{author}</span>}
                        {date && <span className="blog-post-card__date">{date}</span>}
                    </div>
                )}
                {block.actions && block.actions.length > 0 && (
                    <div className="blog-post-card__actions">
                        <ActionRenderer actions={block.actions} variant="ghost" />
                    </div>
                )}
            </div>
        </div>
    );
}
