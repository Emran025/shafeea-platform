import React from 'react';
import type { BlockPayload, RenderContext, RichTextNode, RichTextFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function RichTextBlock({ block, context = 'light' }: Props) {
    const f = block.fields as RichTextFields;
    if (!f?.content) return null;

    return (
        <div className={`prose-accsystem${context === 'dark' ? ' prose-accsystem--dark' : ''}`}>
            <RichTextRenderer doc={f.content} context={context} />
        </div>
    );
}

function RichTextRenderer({ doc, context }: { doc: RichTextNode | null | undefined; context: RenderContext }) {
    if (!doc) return null;
    if (typeof doc === 'string') {
        return <p>{doc as string}</p>;
    }
    const nodes = doc.content ?? (Array.isArray(doc) ? (doc as RichTextNode[]) : [doc]);
    return <>{nodes.map((node, i) => <RichNode key={i} node={node} context={context} />)}</>;
}

function RichNode({ node, context }: { node: RichTextNode; context: RenderContext }) {
    switch (node.type) {
        case 'doc':
            return <div>{(node.content ?? []).map((n, i) => <RichNode key={i} node={n} context={context} />)}</div>;
        case 'paragraph':
            return <p>{renderInline(node.content ?? [], context)}</p>;
        case 'heading': {
            const level = (node.attrs?.level as number) ?? 2;
            const Tag   = `h${level}` as keyof JSX.IntrinsicElements;
            return <Tag>{renderInline(node.content ?? [], context)}</Tag>;
        }
        case 'bulletList':
            return <ul>{(node.content ?? []).map((n, i) => <RichNode key={i} node={n} context={context} />)}</ul>;
        case 'orderedList':
            return <ol>{(node.content ?? []).map((n, i) => <RichNode key={i} node={n} context={context} />)}</ol>;
        case 'listItem':
            return <li>{(node.content ?? []).map((n, i) => <RichNode key={i} node={n} context={context} />)}</li>;
        case 'blockquote':
            return (
                <blockquote>
                    {(node.content ?? []).map((n, i) => <RichNode key={i} node={n} context={context} />)}
                </blockquote>
            );
        case 'hardBreak':
            return <br />;
        default:
            return node.text ? <span>{node.text}</span> : null;
    }
}

function renderInline(nodes: RichTextNode[], context: RenderContext): React.ReactNode[] {
    return nodes.map((node, i) => {
        if (node.type === 'hardBreak') return <br key={i} />;
        let content: React.ReactNode = node.text ?? '';
        const marks = node.marks ?? [];
        marks.forEach(mark => {
            if (mark.type === 'bold')   content = <strong key={i}>{content}</strong>;
            if (mark.type === 'italic') content = <em key={i}>{content}</em>;
            if (mark.type === 'code')   content = <code key={i}>{content}</code>;
            if (mark.type === 'link')   content = <a key={i} href={mark.attrs?.href as string | undefined}>{content}</a>;
        });
        return <React.Fragment key={i}>{content}</React.Fragment>;
    });
}
