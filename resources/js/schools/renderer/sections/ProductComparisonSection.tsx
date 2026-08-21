import React from 'react';
import type { SectionPayload, BlockPayload, PageCore, ColorTokens } from '../../types/engine';
import SectionShell from '../ui/SectionShell';
import SectionHeader from '../ui/SectionHeader';
import { getTextField, getField } from '../../utils/blockFields';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

export default function ProductComparisonSection({ blocks }: Props) {
    const label       = blocks.find(b => b.type === 'label');
    const headline    = blocks.find(b => b.type === 'headline');
    const subheadline = blocks.find(b => b.type === 'subheadline');
    const platforms   = blocks.filter(b => b.type === 'platform_card');
    const rows        = blocks.filter(b => b.type === 'feature_row');

    const checkAvailability = (availablePlatformsStr: string, platformId: string): boolean => {
        if (!availablePlatformsStr) return false;
        return availablePlatformsStr
            .split(',')
            .map(item => item.trim().toUpperCase())
            .includes(platformId.toUpperCase());
    };

    return (
        <SectionShell className="section--product-comparison">
            <SectionHeader
                label={label}
                headline={headline}
                richText={subheadline}
                align="center"
            />

            {platforms.length > 0 && (
                <div className="product-comparison">
                    <div className="product-comparison__table-wrapper">
                        <table className="product-comparison__table">
                            <thead>
                                <tr>
                                    <th className="product-comparison__th product-comparison__th--feature">
                                        Capabilities
                                    </th>
                                    {platforms.map(platform => {
                                        const name = getTextField(platform, 'display_name') || getTextField(platform, 'canonical_name');
                                        const colorTokens = getField<ColorTokens | null>(platform, 'color_tokens', null);
                                        const accent = colorTokens?.accent || '#C9A227';
                                        const siteStatus = getTextField(platform, 'site_status');

                                        return (
                                            <th key={platform.id} className="product-comparison__th product-comparison__th--platform">
                                                <div className="product-comparison__platform-header">
                                                    <span 
                                                        className="product-comparison__platform-name"
                                                        style={{ borderBottom: `2px solid ${accent}` }}
                                                    >
                                                        {name}
                                                    </span>
                                                    {siteStatus !== 'live' && (
                                                        <span className="product-comparison__platform-badge">
                                                            {siteStatus || 'soon'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(row => {
                                    const featureName = getTextField(row, 'label');
                                    const availableStr = getTextField(row, 'tiers');

                                    return (
                                        <tr key={row.id} className="product-comparison__tr">
                                            <td className="product-comparison__td product-comparison__td--feature">
                                                {featureName}
                                            </td>
                                            {platforms.map(platform => {
                                                const platformId = getTextField(platform, 'product_site_id');
                                                const isAvailable = checkAvailability(availableStr, platformId);

                                                return (
                                                    <td 
                                                        key={platform.id} 
                                                        className={`product-comparison__td product-comparison__td--value ${
                                                            isAvailable ? 'product-comparison__td--available' : 'product-comparison__td--unavailable'
                                                        }`}
                                                    >
                                                        {isAvailable ? (
                                                            <span className="product-comparison__check" aria-label="Available">
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                            </span>
                                                        ) : (
                                                            <span className="product-comparison__dash" aria-label="Not Available">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </SectionShell>
    );
}
