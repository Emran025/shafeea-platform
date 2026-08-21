import React, { useState } from 'react';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import BlockRenderer from '../blocks/BlockRenderer';
import SectionShell from '../ui/SectionShell';
import SectionHeader from '../ui/SectionHeader';
import FormDefinitionBlock from '../blocks/FormDefinitionBlock';
import { getTextField } from '../../utils/blockFields';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

export default function ResourceGateSection({ blocks }: Props) {
    const label       = blocks.find(b => b.type === 'label');
    const headline    = blocks.find(b => b.type === 'headline');
    const subheadline = blocks.find(b => b.type === 'subheadline');
    const richText    = blocks.find(b => b.type === 'rich_text');
    const mediaBlock  = blocks.find(b => b.type === 'media');
    const formBlock   = blocks.find(b => b.type === 'form_definition');
    const ctas        = blocks.filter(b => b.type === 'cta');

    const [submitted, setSubmitted] = useState(false);

    const successMessage = formBlock ? getTextField(formBlock, 'success_message') : 'Thank you! Your download is ready.';

    const media = mediaBlock?.media;
    const downloadUrl = media?.variants?.[0]?.url || (mediaBlock ? getTextField(mediaBlock, 'url') : '#');
    const fileAlt = media ? (media.is_decorative ? '' : media.alt_text) : (mediaBlock ? getTextField(mediaBlock, 'alt') : 'Resource Document');

    return (
        <SectionShell className="section--resource-gate">
            <div className="resource-gate__grid">
                <div className="resource-gate__content">
                    {(label || headline || subheadline) && (
                        <SectionHeader
                            label={label}
                            headline={headline}
                            richText={subheadline}
                            align="left"
                        />
                    )}
                    {richText && (
                        <div className="resource-gate__body">
                            <BlockRenderer block={richText} />
                        </div>
                    )}
                    {ctas.length > 0 && (
                        <div className="resource-gate__ctas">
                            {ctas.map(cta => <BlockRenderer key={cta.id} block={cta} />)}
                        </div>
                    )}
                </div>

                <div className="resource-gate__panel">
                    {submitted ? (
                        <div className="resource-gate__success">
                            <div className="resource-gate__success-header">
                                <svg className="resource-gate__success-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5">
                                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <p className="resource-gate__success-text">{successMessage}</p>
                            </div>
                            <div className="resource-gate__download-box">
                                <span className="resource-gate__filename">{fileAlt}</span>
                                <a 
                                    href={downloadUrl} 
                                    className="btn btn--primary resource-gate__download-btn" 
                                    download
                                >
                                    Download File
                                </a>
                            </div>
                        </div>
                    ) : (
                        formBlock && (
                            <FormDefinitionBlock 
                                block={formBlock}
                                onSubmitSuccess={() => setSubmitted(true)}
                            />
                        )
                    )}
                </div>
            </div>
        </SectionShell>
    );
}
