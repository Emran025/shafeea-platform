import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import { getTextField, getField } from '../../utils/blockFields';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

export default function TabbedPricingSection({ blocks }: Props) {
    const headlineBlock = blocks.find(b => b.type === 'pricing_headline');
    const tabBlocks      = blocks.filter(b => b.type === 'pricing_tab');
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    const activeTab = tabBlocks[activeTabIdx];
    const activeTabId = activeTab?.id;

    // Filter content based on active tab
    // Note: In a real CMS, blocks might be nested. 
    // Here we assume a flat list where we might use some logic to associate content with tabs.
    // For this implementation, we'll look for specific block types.
    
    const standardPlan = blocks.find(b => b.type === 'pricing_plan_standard');
    const customPlan   = blocks.find(b => b.type === 'pricing_plan_custom');
    const faqItems     = blocks.filter(b => b.type === 'faq_item');

    const renderTabContent = () => {
        const tabType = activeTab ? getTextField(activeTab, 'tab_type') : 'standard';

        switch (tabType) {
            case 'custom':
                return (
                    <motion.div 
                        key="custom"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="pricing-custom-view"
                    >
                        <div className="pricing-card pricing-card--dark" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                            <h3 className="pricing-card__label">Custom Solutions</h3>
                            <p className="pricing-card__desc">Contact our sales team for a tailored package that fits your specific enterprise needs.</p>
                            <button className="pricing-card__cta pricing-card__cta--white">Contact Sales</button>
                        </div>
                    </motion.div>
                );
            case 'faq':
                return (
                    <motion.div 
                        key="faq"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="pricing-faqs"
                    >
                        {faqItems.map(faq => (
                            <div key={faq.id} className="pricing-faq-item">
                                <h4 className="pricing-faq-item__question">{getTextField(faq, 'question')}</h4>
                                <p className="pricing-faq-item__answer">{getTextField(faq, 'answer')}</p>
                            </div>
                        ))}
                    </motion.div>
                );
            default:
                return (
                    <motion.div 
                        key="standard"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="pricing-grid"
                    >
                        {standardPlan && (
                            <div className="pricing-card">
                                <h3 className="pricing-card__label">{getTextField(standardPlan, 'title')}</h3>
                                <p className="pricing-card__desc">{getTextField(standardPlan, 'description')}</p>
                                <div className="pricing-card__price">{getTextField(standardPlan, 'price_display')}</div>
                                <button className="pricing-card__cta pricing-card__cta--primary">Get Started</button>
                            </div>
                        )}
                        {customPlan && (
                            <div className="pricing-card pricing-card--dark">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 className="pricing-card__label">{getTextField(customPlan, 'title')}</h3>
                                        <p className="pricing-card__desc">{getTextField(customPlan, 'description')}</p>
                                        <div className="pricing-card__price">{getTextField(customPlan, 'cta_label')}</div>
                                        <button className="pricing-card__cta pricing-card__cta--white">{getTextField(customPlan, 'cta_label')}</button>
                                    </div>
                                    <div className="pricing-card__features">
                                        {(getField<string[]>(customPlan, 'features', [])).map((feat, i) => (
                                            <div key={i} className="pricing-feature-tag">{feat}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                );
        }
    };

    return (
        <section className="tabbed-pricing-section">
            <div className="tabbed-pricing__inner">
                {headlineBlock && (
                    <motion.h2 
                        className="tabbed-pricing__headline"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {getTextField(headlineBlock, 'text')}
                    </motion.h2>
                )}

                <div className="tabbed-pricing__content-wrapper">
                    <AnimatePresence mode="wait">
                        {renderTabContent()}
                    </AnimatePresence>
                </div>

                <div className="tabbed-pricing__tabs-nav">
                    {tabBlocks.map((tab, idx) => (
                        <button
                            key={tab.id}
                            className={`tabbed-pricing__tab-btn ${activeTabIdx === idx ? 'tabbed-pricing__tab-btn--active' : ''}`}
                            onClick={() => setActiveTabIdx(idx)}
                        >
                            {getTextField(tab, 'label')}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
