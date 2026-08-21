import React, { useState } from 'react';
import { SECTION_SCHEMAS, GROUPS, type SectionTypeSchema } from '../sectionSchemas';

interface Props {
    onSelect: (schema: SectionTypeSchema) => void;
    onClose:  () => void;
}

export default function SectionTypePickerModal({ onSelect, onClose }: Props) {
    const [activeGroup, setActiveGroup] = useState<string>('all');

    const visible = activeGroup === 'all'
        ? SECTION_SCHEMAS
        : SECTION_SCHEMAS.filter(s => s.group === activeGroup);

    return (
        <div className="adm-modal-backdrop" onClick={onClose}>
            <div
                className="adm-modal adm-modal--lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="adm-modal__header">
                    <h2 className="adm-modal__title">Choose section type</h2>
                    <button className="adm-modal__close" onClick={onClose}>✕</button>
                </div>

                <div className="adm-picker__tabs">
                    <button
                        className={`adm-picker__tab${activeGroup === 'all' ? ' adm-picker__tab--active' : ''}`}
                        onClick={() => setActiveGroup('all')}
                    >
                        All
                    </button>
                    {GROUPS.map(g => (
                        <button
                            key={g.key}
                            className={`adm-picker__tab${activeGroup === g.key ? ' adm-picker__tab--active' : ''}`}
                            onClick={() => setActiveGroup(g.key)}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>

                <div className="adm-picker__grid">
                    {visible.map(schema => (
                        <button
                            key={schema.type}
                            className="adm-picker__card"
                            onClick={() => onSelect(schema)}
                        >
                            <img
                                src={schema.icon}
                                alt=""
                                className="adm-picker__card-icon"
                            />
                            <span className="adm-picker__card-label">{schema.label}</span>
                            <span className="adm-picker__card-desc">{schema.description}</span>
                            <span className="adm-picker__card-type">{schema.type}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
