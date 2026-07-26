import React, { useState } from 'react';
import type { BlockPayload, RenderContext } from '../../types/engine';

interface Props {
    block:            BlockPayload;
    context?:         RenderContext;
    onSubmitSuccess?: () => void;
}

interface FormField {
    field_name:          string;
    label:               string;
    field_type:          'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';
    is_required?:        boolean;
    placeholder?:        string;
    options?:            string[];
    validation_pattern?: string;
}

interface FormDefFields {
    form_title?:      string;
    submit_label?:    string;
    fields?:          FormField[];
    success_message?: string;
}

export default function FormDefinitionBlock({ block, onSubmitSuccess }: Props) {
    const f = block.fields as FormDefFields;
    const { form_title, submit_label, fields = [], success_message } = f ?? {};
    const [values, setValues]       = useState<Record<string, unknown>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        if (onSubmitSuccess) {
            onSubmitSuccess();
        }
    };

    if (submitted) {
        return (
            <div className="form-block__success">
                <svg className="form-block__success-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="form-block__success-text">
                    {success_message || 'Your message has been sent.'}
                </p>
            </div>
        );
    }

    return (
        <form className="form-block" onSubmit={handleSubmit}>
            {form_title && <h3 className="form-block__title">{form_title}</h3>}
            <div className="form-block__fields">
                {fields.map((field, i) => (
                    <FormFieldRow
                        key={i}
                        field={field}
                        value={values[field.field_name]}
                        onChange={v => setValues(prev => ({ ...prev, [field.field_name]: v }))}
                    />
                ))}
            </div>
            <button type="submit" className="form-block__submit">
                {submit_label || 'Submit'}
            </button>
        </form>
    );
}

function FormFieldRow({ field, value, onChange }: { field: FormField; value: unknown; onChange: (v: unknown) => void }) {
    return (
        <div className="form-field">
            <label className="form-field__label">
                {field.label}
                {field.is_required && <span className="form-field__required">*</span>}
            </label>
            {field.field_type === 'textarea' ? (
                <textarea
                    className="form-field__textarea"
                    required={field.is_required}
                    placeholder={field.placeholder ?? ''}
                    value={String(value ?? '')}
                    onChange={e => onChange(e.target.value)}
                    rows={4}
                />
            ) : field.field_type === 'select' ? (
                <select
                    className="form-field__select"
                    required={field.is_required}
                    value={String(value ?? '')}
                    onChange={e => onChange(e.target.value)}
                >
                    <option value="">Select…</option>
                    {(field.options ?? []).map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
            ) : field.field_type === 'checkbox' ? (
                <label className="form-field__checkbox-row">
                    <input
                        type="checkbox"
                        className="form-field__checkbox"
                        required={field.is_required}
                        checked={!!value}
                        onChange={e => onChange(e.target.checked)}
                    />
                    <span className="form-field__checkbox-text">{field.placeholder}</span>
                </label>
            ) : (
                <input
                    className="form-field__input"
                    type={field.field_type === 'email' ? 'email' : field.field_type === 'phone' ? 'tel' : 'text'}
                    required={field.is_required}
                    placeholder={field.placeholder ?? ''}
                    value={String(value ?? '')}
                    onChange={e => onChange(e.target.value)}
                    pattern={field.validation_pattern ?? undefined}
                />
            )}
        </div>
    );
}
