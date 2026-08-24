import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import { getTextField } from '../../utils/blockFields';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

export default function ComparisonTableSection({ blocks }: Props) {
    const label       = blocks.find(b => b.type === 'label');
    const headline    = blocks.find(b => b.type === 'headline');
    const subheadline = blocks.find(b => b.type === 'subheadline') || blocks.find(b => b.type === 'rich_text');
    const rows        = blocks.filter(b => b.type === 'comparison_row');

    // Sort rows by position to guarantee logical ordering
    const sortedRows = [...rows].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    // Detect locale for table headers
    const isAr = typeof document !== 'undefined' && 
        (document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl');

    const headers = isAr ? {
        aspect: 'الجانب التشغيلي',
        before: 'الأنظمة التقليدية',
        after: 'مع منصة المدرسة'
    } : {
        aspect: 'Operational Aspect',
        before: 'Legacy Systems',
        after: 'مع منصة المدرسة'
    };

    return (
        <div className="container">
            <SectionHeader
                label={label}
                headline={headline}
                richText={subheadline}
                align="center"
            />

            {sortedRows.length > 0 && (
                <div className="comparison-table">
                    {/* Desktop View */}
                    <div className="comparison-table__desktop">
                        <table className="comparison-table__table">
                            <thead>
                                <tr>
                                    <th className="comparison-table__th comparison-table__th--aspect">
                                        {headers.aspect}
                                    </th>
                                    <th className="comparison-table__th comparison-table__th--before">
                                        {headers.before}
                                    </th>
                                    <th className="comparison-table__th comparison-table__th--after">
                                        {headers.after}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedRows.map((row) => {
                                    const aspect = getTextField(row, 'label') || getTextField(row, 'dimension');
                                    const before = getTextField(row, 'before');
                                    const after  = getTextField(row, 'after');

                                    return (
                                        <tr key={row.id} className="comparison-table__tr">
                                            <td className="comparison-table__td comparison-table__td--aspect">
                                                {aspect}
                                            </td>
                                            <td className="comparison-table__td comparison-table__td--before">
                                                <span className="comparison-table__badge-before">
                                                    ✕
                                                </span>
                                                <span className="comparison-table__text-before">{before}</span>
                                            </td>
                                            <td className="comparison-table__td comparison-table__td--after">
                                                <span className="comparison-table__badge-after">
                                                    ✓
                                                </span>
                                                <span className="comparison-table__text-after">{after}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="comparison-table__mobile">
                        {sortedRows.map((row, idx) => {
                            const aspect = getTextField(row, 'label') || getTextField(row, 'dimension');
                            const before = getTextField(row, 'before');
                            const after  = getTextField(row, 'after');

                            return (
                                <motion.div
                                    key={row.id}
                                    className="comparison-card"
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                >
                                    <div className="comparison-card__header">
                                        <span className="comparison-card__aspect">{aspect}</span>
                                    </div>
                                    <div className="comparison-card__body">
                                        <div className="comparison-card__state comparison-card__state--before">
                                            <span className="comparison-card__state-label">{headers.before}</span>
                                            <p className="comparison-card__state-text">{before}</p>
                                        </div>
                                        <div className="comparison-card__state comparison-card__state--after">
                                            <span className="comparison-card__state-label">{headers.after}</span>
                                            <p className="comparison-card__state-text">{after}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
