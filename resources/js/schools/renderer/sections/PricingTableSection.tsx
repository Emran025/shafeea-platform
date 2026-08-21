import React, { useState } from 'react';
import { motion }           from 'framer-motion';
import SectionHeader        from '../ui/SectionHeader';
import BlockRenderer        from '../blocks/BlockRenderer';
import type {
    SectionPayload, BlockPayload, PageCore,
    PricingTierCardFields, FeatureRowFields,
} from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

/**
 * PricingTableSection — edition comparison table.
 *
 * Block layout expected:
 *   - label / headline / subheadline  → section header
 *   - pricing_tier_card[]             → column headers (Starter / Growth / Enterprise)
 *   - feature_row[]                   → table rows (one feature per row)
 *   - cta[]                           → bottom CTA row
 *
 * Renders as a sticky-header comparison table on desktop,
 * and a card-per-tier accordion on mobile.
 */
export default function PricingTableSection({ blocks }: Props) {
    const label      = blocks.find(b => b.type === 'label');
    const headline   = blocks.find(b => b.type === 'headline');
    const subhead    = blocks.find(b => b.type === 'subheadline');
    const tierCards  = blocks.filter(b => b.type === 'pricing_tier_card');
    const featureRows = blocks.filter(b => b.type === 'feature_row');
    const ctas       = blocks.filter(b => b.type === 'cta');

    const tierNames = tierCards.map(t => (t.fields as unknown as PricingTierCardFields).tier_name);

    return (
            <div className="container">
                {(label || headline || subhead) && (
                    <SectionHeader label={label} headline={headline} richText={subhead} align="center" />
                )}

                {/* ── Desktop comparison table ─────────────────────────── */}
                <motion.div
                    className="pricing-table"
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                >
                    {/* Header row — tier cards */}
                    <div className={`pricing-table__header pricing-table__header--cols-${tierCards.length}`}>
                        <div className="pricing-table__feature-label-cell" />
                        {tierCards.map(tier => (
                            <div key={tier.id} className="pricing-table__tier-header">
                                <BlockRenderer block={tier} />
                            </div>
                        ))}
                    </div>

                    {/* Feature rows */}
                    {featureRows.length > 0 && (
                        <div className="pricing-table__body">
                            {featureRows.map((row, i) => {
                                const f = row.fields as unknown as FeatureRowFields;
                                return (
                                    <div
                                        key={row.id}
                                        className={`pricing-table__row${i % 2 === 0 ? ' pricing-table__row--alt' : ''}`}
                                    >
                                        <div className="pricing-table__feature-name">
                                            {f.feature_name}
                                        </div>
                                        {tierNames.map(tier => (
                                            <div key={tier} className="pricing-table__cell">
                                                <FeatureValue value={f.tier_values?.[tier] ?? '—'} />
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer CTA row */}
                    {ctas.length > 0 && (
                        <div className={`pricing-table__footer pricing-table__footer--cols-${tierCards.length}`}>
                            <div className="pricing-table__feature-label-cell" />
                            {ctas.slice(0, tierCards.length).map(cta => (
                                <div key={cta.id} className="pricing-table__cta-cell">
                                    <BlockRenderer block={cta} />
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* ── Mobile tier accordion ────────────────────────────── */}
                <MobilePricingAccordion tierCards={tierCards} featureRows={featureRows} />
            </div>
    );
}

// ─── Mobile accordion ─────────────────────────────────────────────────────────

interface MobileProps { tierCards: BlockPayload[]; featureRows: BlockPayload[]; }

function MobilePricingAccordion({ tierCards, featureRows }: MobileProps) {
    const [active, setActive] = useState<string | null>(null);

    return (
        <div className="pricing-accordion">
            {tierCards.map(tier => {
                const f       = tier.fields as unknown as PricingTierCardFields;
                const isOpen  = active === tier.id;

                return (
                    <div key={tier.id} className={`pricing-accordion__item${f.is_featured ? ' pricing-accordion__item--featured' : ''}`}>
                        <button
                            className="pricing-accordion__trigger"
                            onClick={() => setActive(isOpen ? null : tier.id)}
                            aria-expanded={isOpen}
                        >
                            <span className="pricing-accordion__tier-name">{f.tier_name}</span>
                            <span className="pricing-accordion__price">{f.price}</span>
                            <span className={`pricing-accordion__chevron${isOpen ? ' pricing-accordion__chevron--open' : ''}`}>▾</span>
                        </button>

                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="pricing-accordion__body"
                            >
                                {featureRows.map(row => {
                                    const rf  = row.fields as unknown as FeatureRowFields;
                                    const val = rf.tier_values?.[f.tier_name] ?? '—';
                                    return (
                                        <div key={row.id} className="pricing-accordion__row">
                                            <span className="pricing-accordion__feature">{rf.feature_name}</span>
                                            <FeatureValue value={val} />
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── FeatureValue — renders ✓ / ✗ / custom string ────────────────────────────

function FeatureValue({ value }: { value: string }) {
    if (value === '✓' || value === 'true' || value === 'yes') {
        return <span className="pricing-table__check" aria-label="Included">✓</span>;
    }
    if (value === '—' || value === 'false' || value === 'no') {
        return <span className="pricing-table__dash" aria-label="Not included">—</span>;
    }
    return <span className="pricing-table__value">{value}</span>;
}
