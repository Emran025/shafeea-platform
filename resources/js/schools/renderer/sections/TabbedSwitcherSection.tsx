import React, { useState } from 'react';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import SectionShell from '../ui/SectionShell';
import SectionHeader from '../ui/SectionHeader';
import { getTextField } from '../../utils/blockFields';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

export default function TabbedSwitcherSection({ blocks }: Props) {
    const label       = blocks.find(b => b.type === 'label');
    const headline    = blocks.find(b => b.type === 'headline');
    const subheadline = blocks.find(b => b.type === 'subheadline');
    const tabs        = blocks.filter(b => b.type === 'feature_item');

    const [activeTab, setActiveTab] = useState<number>(0);

    return (
        <SectionShell className="section--tabbed-switcher">
            <SectionHeader
                label={label}
                headline={headline}
                richText={subheadline}
                align="center"
            />

            {tabs.length > 0 && (
                <div className="tabbed-switcher">
                    <div className="tabbed-switcher__tabs" role="tablist">
                        {tabs.map((tab, index) => {
                            const title = getTextField(tab, 'label') || `Tab ${index + 1}`;
                            const isActive = activeTab === index;

                            return (
                                <button
                                    key={tab.id}
                                    className={`tabbed-switcher__tab-btn ${isActive ? 'tabbed-switcher__tab-btn--active' : ''}`}
                                    onClick={() => setActiveTab(index)}
                                    role="tab"
                                    aria-selected={isActive}
                                    type="button"
                                >
                                    {title}
                                </button>
                            );
                        })}
                    </div>

                    <div className="tabbed-switcher__panel-container">
                        {tabs.map((tab, index) => {
                            const content = getTextField(tab, 'description') || getTextField(tab, 'text');
                            const isActive = activeTab === index;

                            if (!isActive) return null;

                            return (
                                <div
                                    key={tab.id}
                                    className="tabbed-switcher__panel"
                                    role="tabpanel"
                                    style={{
                                        animation: 'fadeIn 0.3s ease-in-out'
                                    }}
                                >
                                    <p className="tabbed-switcher__content">{content}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </SectionShell>
    );
}
