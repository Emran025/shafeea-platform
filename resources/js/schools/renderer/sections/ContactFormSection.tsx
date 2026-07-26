import React from 'react';
import BlockRenderer from '../blocks/BlockRenderer';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

export default function ContactFormSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const richText = blocks.find(b => b.type === 'rich_text');
    const formDef  = blocks.find(b => b.type === 'form_definition');

    return (
        <div className="container">
            <div className="container">
                <div className={`contact-form__grid${richText ? ' contact-form__grid--with-text' : ''}`}>
                    <div className="contact-form__body">
                        {label    && <BlockRenderer block={label} />}
                        {headline && <BlockRenderer block={headline} />}
                        {richText && <BlockRenderer block={richText} />}
                        <div className="contact-form__privacy">
                            <p className="contact-form__privacy-text">
                                Your information is handled with strict confidentiality in
                                accordance with our privacy policy.
                            </p>
                        </div>
                    </div>
                    {formDef && (
                        <div className="contact-form__panel">
                            <BlockRenderer block={formDef} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
