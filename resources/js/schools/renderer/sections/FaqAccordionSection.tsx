import { useState, useEffect } from 'react';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import SectionShell from '../ui/SectionShell';
import SectionHeader from '../ui/SectionHeader';
import { getTextField } from '../../utils/blockFields';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

export default function FaqAccordionSection({ section, blocks }: Props) {
    const label       = blocks.find(b => b.type === 'label');
    const headline    = blocks.find(b => b.type === 'headline');
    const subheadline = blocks.find(b => b.type === 'subheadline');
    const faqItems    = blocks.filter(b => b.type === 'feature_item');

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    // SEO structured data injection
    useEffect(() => {
        if (faqItems.length === 0) return;

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
                "@type": "Question",
                "name": getTextField(item, 'label'),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": getTextField(item, 'description')
                }
            }))
        };

        const scriptId = `faq-schema-${section.id}`;
        let script = document.getElementById(scriptId) as HTMLScriptElement;
        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.text = JSON.stringify(faqSchema);

        return () => {
            const el = document.getElementById(scriptId);
            if (el) el.remove();
        };
    }, [faqItems, section.id]);

    return (
        <SectionShell className="section--faq-accordion">
            <SectionHeader
                label={label}
                headline={headline}
                richText={subheadline}
                align="center"
            />

            {faqItems.length > 0 && (
                <div className="faq-accordion">
                    {faqItems.map((item, index) => {
                        const question = getTextField(item, 'label');
                        const answer   = getTextField(item, 'description');
                        const isOpen   = openIndex === index;

                        return (
                            <div 
                                key={item.id} 
                                className={`faq-accordion__item ${isOpen ? 'faq-accordion__item--open' : ''}`}
                            >
                                <button
                                    className="faq-accordion__trigger"
                                    onClick={() => toggleAccordion(index)}
                                    aria-expanded={isOpen}
                                    type="button"
                                >
                                    <span className="faq-accordion__question">{question}</span>
                                    <span className="faq-accordion__icon" aria-hidden="true">
                                        {isOpen ? '−' : '+'}
                                    </span>
                                </button>
                                <div 
                                    className="faq-accordion__content-wrapper"
                                    style={{
                                        maxHeight: isOpen ? '500px' : '0px',
                                        opacity: isOpen ? 1 : 0,
                                        transition: 'max-height 0.35s ease, opacity 0.3s ease',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div className="faq-accordion__content">
                                        <p className="faq-accordion__answer">{answer}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </SectionShell>
    );
}
