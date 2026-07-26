import React from 'react';
import { motion } from 'framer-motion';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import { getTextField, getField } from '../../utils/blockFields';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

const Icons: Record<string, React.ReactNode> = {
    globe: (
        <svg className="feature-tile__icon" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    ),
    shield: (
        <svg className="feature-tile__icon" fill="none" stroke="#10b981" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    cart: (
        <svg className="feature-tile__icon" fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    chart: (
        <svg className="feature-tile__icon" fill="none" stroke="#6366f1" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002 2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    payment: (
        <svg className="feature-tile__icon" fill="none" stroke="#ec4899" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    support: (
        <svg className="feature-tile__icon" fill="none" stroke="#8b5cf6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    embed: (
        <svg className="feature-tile__icon" fill="none" stroke="#f43f5e" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
    payout: (
        <svg className="feature-tile__icon" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
};

export default function FeatureGridSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const tiles    = blocks.filter(b => b.type === 'feature_tile');

    const labelText    = label    ? String((label.fields    as Record<string, unknown>)?.text ?? '') : null;
    const headlineText = headline ? String((headline.fields as Record<string, unknown>)?.text ?? '') : 'Everything your operations need.';

    return (
        <div className="feature-grid-section">
            <div className="feature-grid__inner">
                {labelText && (
                    <p className="feature-grid__label">{labelText}</p>
                )}
                <h2 className="feature-grid__header">{headlineText}</h2>

                <div className="feature-grid__grid">
                    {tiles.map((tile, idx) => {
                        const iconName = getTextField(tile, 'icon_name');
                        const title    = getTextField(tile, 'title') || getTextField(tile, 'label');
                        const bullets  = getField<string[]>(tile, 'bullets', []);
                        const description = getTextField(tile, 'description');

                        return (
                            <motion.div
                                key={tile.id}
                                className="feature-tile"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <div className="feature-tile__icon-wrapper">
                                    {Icons[iconName] || (
                                        <svg className="feature-tile__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>

                                <div className="feature-tile__title-group">
                                    <div className="feature-tile__accent-line" />
                                    <h3 className="feature-tile__title">{title}</h3>
                                </div>

                                {bullets.length > 0 ? (
                                    <ul className="feature-tile__bullets">
                                        {bullets.map((bullet, i) => (
                                            <li key={i} className="feature-tile__bullet">
                                                <svg className="feature-tile__check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    description && (
                                        <p className="feature-tile__description" style={{ fontSize: '0.9375rem', color: '#64748b', lineHeight: 1.5 }}>
                                            {description}
                                        </p>
                                    )
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
