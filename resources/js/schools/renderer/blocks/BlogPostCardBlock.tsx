import React from 'react';
import ActionRenderer from './ActionRenderer';
import type { BlockPayload, RenderContext, BlogPostCardFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function BlogPostCardBlock({ block }: Props) {
    const f = block.fields as unknown as BlogPostCardFields;
    const { title = '', author = '', date = '', category = '', summary = '' } = f ?? {};

    return (
        <div className="blog-post-card">
            <span className="blog-post-card__category">{category}</span>
            <h3 className="blog-post-card__title">{title}</h3>
            <p className="blog-post-card__summary">{summary}</p>
            <div className="blog-post-card__meta">
                <span className="blog-post-card__author">{author}</span>
                <span className="blog-post-card__date">{date}</span>
            </div>
            {block.actions && block.actions.length > 0 && (
                <div className="blog-post-card__actions">
                    <ActionRenderer actions={block.actions} variant="ghost" />
                </div>
            )}
        </div>
    );
}
