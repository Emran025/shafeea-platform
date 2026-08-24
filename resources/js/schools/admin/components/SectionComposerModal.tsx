import React, { useState, useCallback } from 'react';
import type { AdminSection } from '../types';
import type { SectionTypeSchema, BlockDef, FieldDef } from '../sectionSchemas';
import { composeSection, updateSectionCompose, type BlockInput } from '../api/adminClient';
import Button from './Button';

interface Props {
    schema:      SectionTypeSchema;
    pageId:      string;
    section?:    AdminSection;   // provided when editing an existing section
    position?:   number;         // suggested position when creating
    onSuccess:   (section: AdminSection) => void;
    onClose:     () => void;
}

type FieldValues = Record<string, string>;

type FormData = { _name: string } & { [key: string]: FieldValues | FieldValues[] | string };

function emptyFields(fields: FieldDef[]): FieldValues {
    return Object.fromEntries(fields.map(f => [f.key, '']));
}

function extractBlockFields(block: (NonNullable<AdminSection['blocks']>[number]) | undefined): FieldValues {
    if (!block) return {};
    const content = (block as unknown as { content?: unknown }).content as Record<string, unknown> | null;
    const fields = (content?.en as Record<string, unknown>)?.fields as FieldValues | undefined;
    return fields ?? {};
}

function initFormData(
    schema: SectionTypeSchema,
    section?: AdminSection,
): FormData {
    const existingBlocks = section?.blocks ?? [];

    const data: FormData = {
        _name: section?.identity_name ?? '',
    };

    for (const blockDef of schema.blocks) {
        if (blockDef.multiple) {
            const matching = existingBlocks.filter(b => b.type === blockDef.blockType);
            data[blockDef.key] = matching.length > 0
                ? matching.map(b => extractBlockFields(b))
                : [emptyFields(blockDef.fields)];
        } else {
            const match = existingBlocks.find(b => b.type === blockDef.blockType);
            data[blockDef.key] = match
                ? extractBlockFields(match)
                : emptyFields(blockDef.fields);
        }
    }

    return data;
}

function buildBlocks(
    schema: SectionTypeSchema,
    formData: FormData,
): BlockInput[] {
    const blocks: BlockInput[] = [];

    for (const blockDef of schema.blocks) {
        if (blockDef.multiple) {
            const items = formData[blockDef.key] as FieldValues[];
            for (const fields of items) {
                const hasValue = Object.values(fields).some(v => v && String(v).trim() !== '');
                if (hasValue) {
                    blocks.push({ type: blockDef.blockType, fields });
                }
            }
        } else {
            const fields = formData[blockDef.key] as FieldValues;
            const hasValue = Object.values(fields).some(v => v && String(v).trim() !== '');
            if (hasValue || !blockDef.optional) {
                blocks.push({ type: blockDef.blockType, fields });
            }
        }
    }

    return blocks;
}

// ─── Sub-components ───────────────────────────────────────────────────────

function FieldInput({
    fieldDef,
    value,
    onChange,
}: {
    fieldDef: FieldDef;
    value:    string;
    onChange: (v: string) => void;
}) {
    if (fieldDef.type === 'boolean') {
        return (
            <label className="adm-form-check">
                <input
                    type="checkbox"
                    checked={value === 'true'}
                    onChange={e => onChange(e.target.checked ? 'true' : 'false')}
                />
                <span>{fieldDef.label}</span>
            </label>
        );
    }

    if (fieldDef.type === 'select' && fieldDef.options) {
        return (
            <div className="adm-form-group">
                <label className="adm-form-label">
                    {fieldDef.label}
                    {fieldDef.required && <span className="adm-form-required">*</span>}
                </label>
                <select
                    className="adm-form-select"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                >
                    <option value="">— Select —</option>
                    {fieldDef.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        );
    }

    if (fieldDef.type === 'textarea') {
        return (
            <div className="adm-form-group">
                <label className="adm-form-label">
                    {fieldDef.label}
                    {fieldDef.required && <span className="adm-form-required">*</span>}
                </label>
                <textarea
                    className="adm-form-textarea"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={fieldDef.placeholder}
                    rows={3}
                />
            </div>
        );
    }

    return (
        <div className="adm-form-group">
            <label className="adm-form-label">
                {fieldDef.label}
                {fieldDef.required && <span className="adm-form-required">*</span>}
            </label>
            <input
                className="adm-form-input"
                type={fieldDef.type === 'url' ? 'text' : 'text'}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={fieldDef.placeholder}
            />
        </div>
    );
}

function SingleBlockEditor({
    blockDef,
    values,
    onChange,
}: {
    blockDef: BlockDef;
    values:   FieldValues;
    onChange: (values: FieldValues) => void;
}) {
    return (
        <div className="adm-composer__block">
            <div className="adm-composer__block-label">
                {blockDef.label}
                {blockDef.optional && <span className="adm-composer__optional"> (optional)</span>}
            </div>
            {blockDef.fields.map(f => (
                <FieldInput
                    key={f.key}
                    fieldDef={f}
                    value={values[f.key] ?? ''}
                    onChange={v => onChange({ ...values, [f.key]: v })}
                />
            ))}
        </div>
    );
}

function MultiBlockEditor({
    blockDef,
    items,
    onChange,
}: {
    blockDef: BlockDef;
    items:    FieldValues[];
    onChange: (items: FieldValues[]) => void;
}) {
    const addItem = () => onChange([...items, emptyFields(blockDef.fields)]);
    const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx));
    const updateItem = (idx: number, values: FieldValues) => {
        const next = [...items];
        next[idx] = values;
        onChange(next);
    };

    return (
        <div className="adm-composer__block adm-composer__block--multi">
            <div className="adm-composer__block-label">{blockDef.label}</div>
            {items.map((item, idx) => (
                <div key={idx} className="adm-composer__multi-item">
                    <div className="adm-composer__multi-item-header">
                        <span className="adm-composer__item-num">
                            {blockDef.itemLabel ?? 'Item'} {idx + 1}
                        </span>
                        {items.length > 1 && (
                            <button
                                className="adm-composer__remove-btn"
                                type="button"
                                onClick={() => removeItem(idx)}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                    {blockDef.fields.map(f => (
                        <FieldInput
                            key={f.key}
                            fieldDef={f}
                            value={item[f.key] ?? ''}
                            onChange={v => updateItem(idx, { ...item, [f.key]: v })}
                        />
                    ))}
                </div>
            ))}
            <button className="adm-composer__add-btn" type="button" onClick={addItem}>
                + Add {blockDef.itemLabel ?? 'item'}
            </button>
        </div>
    );
}

// ─── Main modal ───────────────────────────────────────────────────────────

export default function SectionComposerModal({
    schema, pageId, section, position, onSuccess, onClose,
}: Props) {
    const isEditing = !!section;

    const [formData, setFormData] = useState(() => initFormData(schema, section));
    const [saving,   setSaving]   = useState(false);
    const [error,    setError]    = useState<string | null>(null);

    const updateField = useCallback(
        (key: string, value: FieldValues | FieldValues[]) => {
            setFormData(prev => ({ ...prev, [key]: value }));
        },
        [],
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        const blocks = buildBlocks(schema, formData);
        if (blocks.length === 0) {
            setError('Please fill in at least one field.');
            setSaving(false);
            return;
        }

        try {
            let result: AdminSection;
            if (isEditing && section) {
                result = await updateSectionCompose(section.id, {
                    identity_name: formData._name || schema.label,
                    blocks,
                });
            } else {
                result = await composeSection({
                    page_id:           pageId,
                    type:              schema.type,
                    identity_name:     formData._name || schema.label,
                    ordering_position: position,
                    blocks,
                });
            }
            onSuccess(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="adm-modal-backdrop" onClick={onClose}>
            <div
                className="adm-modal adm-modal--xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="adm-modal__header">
                    <div className="adm-modal__header-inner">
                        <img src={schema.icon} alt="" className="adm-modal__section-icon" />
                        <div>
                            <h2 className="adm-modal__title">
                                {isEditing ? 'Edit' : 'Add'} — {schema.label}
                            </h2>
                            <p className="adm-modal__subtitle">{schema.description}</p>
                        </div>
                    </div>
                    <button className="adm-modal__close" onClick={onClose}>✕</button>
                </div>

                <form className="adm-modal__body" onSubmit={handleSubmit}>
                    <div className="adm-composer__section-name">
                        <div className="adm-form-group">
                            <label className="adm-form-label">Section name (internal)</label>
                            <input
                                className="adm-form-input"
                                type="text"
                                value={formData._name}
                                onChange={e => setFormData(prev => ({ ...prev, _name: e.target.value }))}
                                placeholder={schema.label}
                            />
                        </div>
                    </div>

                    <div className="adm-composer__divider" />

                    {schema.blocks.map(blockDef => {
                        if (blockDef.multiple) {
                            return (
                                <MultiBlockEditor
                                    key={blockDef.key}
                                    blockDef={blockDef}
                                    items={formData[blockDef.key] as FieldValues[]}
                                    onChange={v => updateField(blockDef.key, v)}
                                />
                            );
                        }
                        return (
                            <SingleBlockEditor
                                key={blockDef.key}
                                blockDef={blockDef}
                                values={formData[blockDef.key] as FieldValues}
                                onChange={v => updateField(blockDef.key, v)}
                            />
                        );
                    })}

                    {error && <div className="adm-form-error">{error}</div>}

                    <div className="adm-modal__footer">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={saving}
                            loadingText={isEditing ? 'Saving changes…' : 'Creating section…'}
                        >
                            {isEditing ? 'Save changes' : 'Create section'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
