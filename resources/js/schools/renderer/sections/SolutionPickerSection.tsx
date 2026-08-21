import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import { getTextField } from '../../utils/blockFields';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

const Icons: Record<string, React.ReactNode> = {
    globe: (
        <svg className="persona-button__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    ),
    shield: (
        <svg className="persona-button__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    cart: (
        <svg className="persona-button__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    chart: (
        <svg className="persona-button__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002 2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    payment: (
        <svg className="persona-button__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    support: (
        <svg className="persona-button__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
};

export default function SolutionPickerSection({ blocks }: Props) {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const personaBlocks = blocks.filter(b => b.type === 'persona_item');

    const handleSelect = (id: string, slug: string) => {
        setSelectedId(id);
        // Animate then navigate
        setTimeout(() => {
            navigate(slug.startsWith('/') ? slug : `/${slug}`);
        }, 600);
    };

    return (
        <div className="solution-picker-section">
            <div className="solution-picker__inner">
                <motion.h2 
                    className="solution-picker__headline"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    I am...
                </motion.h2>

                <div className="solution-picker__grid">
                    {personaBlocks.map((block) => {
                        const label = getTextField(block, 'label');
                        const slug  = getTextField(block, 'destination_slug');
                        const icon  = getTextField(block, 'icon_name');
                        const isSelected = selectedId === block.id;
                        const isDimmed = selectedId !== null && !isSelected;

                        return (
                            <motion.button
                                key={block.id}
                                className={`persona-button ${isSelected ? 'persona-button--selected' : ''} ${isDimmed ? 'persona-button--dimmed' : ''}`}
                                onClick={() => handleSelect(block.id, slug)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={isSelected ? { scale: [1, 1.1, 1.05] } : {}}
                                transition={{ duration: 0.2 }}
                            >
                                {Icons[icon] || (
                                    <span className="persona-button__icon">👤</span>
                                )}
                                {label}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
