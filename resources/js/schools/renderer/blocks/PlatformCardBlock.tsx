import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { BlockPayload, RenderContext, PlatformCardFields } from '../../types/engine';
import { getSchoolLogo } from '../../utils/schoolBranding';

interface Props { block: BlockPayload; context?: RenderContext; }

function getIconForPlatform(name: string, role?: string): string {
    const text = (name + ' ' + (role || '')).toLowerCase();
    if (text.includes('account'))                return 'account_accountant.svg';
    if (text.includes('crm') || text.includes('customer')) return 'crm.svg';
    if (text.includes('hr')  || text.includes('human'))    return 'hr.svg';
    if (text.includes('sale')|| text.includes('commerce')) return 'sale.svg';
    if (text.includes('project'))                return 'project.svg';
    if (text.includes('stock')|| text.includes('inventory'))return 'stock.svg';
    if (text.includes('website'))                return 'website.svg';
    if (text.includes('marketing'))              return 'marketing_automation.svg';
    if (text.includes('data'))                   return 'databases.svg';
    const fallbacks = ['ai_app.svg', 'certification_organism.svg', 'cloud.svg', 'corporate_gifts.svg', 'software_reseller.svg'];
    return fallbacks[Math.abs(text.length) % fallbacks.length] || 'account.svg';
}

export default function PlatformCardBlock({ block }: Props) {
    const f           = block.fields as unknown as PlatformCardFields;
    const accent      = f?.color_tokens?.accent ?? '#C9A227';
    const name        = f?.display_name ?? f?.canonical_name ?? '';
    const displayCase = f?.display_case ?? 'lowercase_product';
    const formatted   = displayCase === 'uppercase' ? name.toUpperCase() : name.toLowerCase();
    const iconName    = (f as unknown as Record<string, unknown>)?.icon as string || getIconForPlatform(name, f?.ecosystem_role);
    const iconUrl     = iconName.startsWith('/') || iconName.startsWith('http') ? iconName : `/schools/icons/${iconName}`;

    return (
        <motion.div
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="platform-card"
        >
            <div
                className="platform-card__accent-orb"
                style={{ background: accent }}
            />

            <div className="platform-card__header">
                <div className="platform-card__icon-wrap">
                    <img
                        src={iconUrl}
                        alt={name}
                        className="platform-card__icon-img"
                        onError={e => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (!target.dataset.fallback) {
                                target.dataset.fallback = 'true';
                                target.src = getSchoolLogo();
                            }
                        }}
                    />
                </div>
                {f?.site_status !== 'live' && (
                    <span className="platform-card__status-badge">
                        {f?.site_status ?? 'coming soon'}
                    </span>
                )}
            </div>

            <div className="platform-card__meta">
                <h3 className={`platform-card__name${displayCase === 'uppercase' ? ' platform-card__name--wide' : ''}`}>
                    {formatted}
                </h3>
                {f?.ecosystem_role && (
                    <p className="platform-card__role" style={{ color: accent }}>
                        {f.ecosystem_role}
                    </p>
                )}
            </div>

            <div className="platform-card__body">
                {f?.positioning_tagline && (
                    <p className="platform-card__tagline">{f.positioning_tagline}</p>
                )}
                {f?.short_description && (
                    <p className="platform-card__desc">{f.short_description}</p>
                )}
            </div>

            <div className="platform-card__footer">
                {f?.cta_is_available && f?.cta_url ? (
                    <a
                        href={f.cta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="platform-card__cta"
                        style={{ background: accent, color: '#0F2741' }}
                    >
                        {f.cta_label || 'Explore Platform'}
                        <ExternalLink className="platform-card__cta-icon" width={14} height={14} />
                    </a>
                ) : (
                    <span className="platform-card__unavailable">
                        {f?.unavailable_label || 'In Development'}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
