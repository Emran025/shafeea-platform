import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { AdminPage, AdminSection, WorkflowStatus } from '../types';
import {
    fetchPage,
    fetchPages,
    fetchSections,
    fetchSection,
    deleteSection,
    updateSection,
    updatePage,
    ValidationError,
} from '../api/adminClient';
import type { UpdatePagePayload } from '../api/adminClient';
import { SCHEMA_MAP } from '../sectionSchemas';
import WorkflowBadge    from '../components/WorkflowBadge';
import WorkflowActions  from '../components/WorkflowActions';
import AuditTrail       from '../components/AuditTrail';
import SectionTypePickerModal from '../components/SectionTypePickerModal';
import SectionComposerModal   from '../components/SectionComposerModal';
import type { SectionTypeSchema } from '../sectionSchemas';
import Button from '../components/Button';

function pageTitle(page: AdminPage): string {
    if (!page.identity_title) return page.slug;
    const t = page.identity_title;
    return t['en'] ?? Object.values(t)[0] ?? page.slug;
}

// ─── Section panel ────────────────────────────────────────────────────────

interface SectionPanelProps {
    section:      AdminSection;
    pageId:       string;
    onRefresh:    () => void;
}

function SectionPanel({ section, pageId, onRefresh }: SectionPanelProps) {
    const [open,       setOpen]       = useState(false);
    const [auditOpen,  setAuditOpen]  = useState(false);
    const [composerOpen, setComposerOpen] = useState(false);
    const [fullSection,  setFullSection]  = useState<AdminSection | null>(null);
    const [deleting,   setDeleting]   = useState(false);
    const [deleteErr,  setDeleteErr]  = useState<string | null>(null);

    // Styling sub-section state
    const [stylingOpen,    setStylingOpen]    = useState(false);
    const [bgImageUrl,     setBgImageUrl]     = useState(section.background_image_url ?? '');
    const [cssClasses,     setCssClasses]     = useState(section.custom_css_classes ?? '');
    const [stylingSaving,  setStylingSaving]  = useState(false);
    const [stylingSuccess, setStylingSuccess] = useState<string | null>(null);
    const [stylingError,   setStylingError]   = useState<string | null>(null);

    const isLocked    = section.status === 'in_review';
    const isPublished = section.status === 'published';
    const schema      = SCHEMA_MAP[section.type];

    const handleSaveStyling = async (e: React.FormEvent) => {
        e.preventDefault();
        setStylingSaving(true);
        setStylingError(null);
        setStylingSuccess(null);
        try {
            await updateSection(section.id, {
                background_image_url: bgImageUrl || null,
                custom_css_classes:   cssClasses || null,
            });
            setStylingSuccess('Styling saved.');
            setTimeout(() => setStylingSuccess(null), 3000);
            onRefresh();
        } catch (err) {
            setStylingError(err instanceof Error ? err.message : 'Save failed');
        } finally {
            setStylingSaving(false);
        }
    };

    const openEditor = async () => {
        try {
            const full = await fetchSection(section.id);
            setFullSection(full);
            setComposerOpen(true);
        } catch {
            setComposerOpen(true);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete section "${section.identity_name ?? section.type}"? This cannot be undone.`)) return;
        setDeleting(true);
        setDeleteErr(null);
        try {
            await deleteSection(section.id);
            onRefresh();
        } catch (e) {
            setDeleteErr(e instanceof Error ? e.message : 'Delete failed');
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="adm-section-panel">
                <div
                    onClick={() => setOpen(o => !o)}
                    className={`adm-section-panel__head${isLocked ? ' adm-section-panel__head--locked' : ''}`}
                >
                    <div className="adm-section-panel__left">
                        <span className="adm-section-panel__type">{section.type}</span>
                        <span className="adm-section-panel__name">
                            {section.identity_name ?? 'Unnamed Section'}
                        </span>
                        {section.identity_anchor_id && (
                            <span className="adm-section-panel__anchor">#{section.identity_anchor_id}</span>
                        )}
                        {section.blocks && section.blocks.length > 0 && (
                            <span className="adm-section-panel__block-count">
                                {section.blocks.length} block{section.blocks.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <div className="adm-section-panel__right">
                        <WorkflowBadge status={section.status as WorkflowStatus} size="sm" />
                        <span className="adm-section-panel__chevron">{open ? '▲' : '▼'}</span>
                    </div>
                </div>

                {open && (
                    <div className="adm-section-panel__body">
                        {isLocked && (
                            <div className="adm-lock-notice">
                                <span className="adm-lock-notice__icon">
                                    <img src="/icons/sign.svg" alt="" className="adm-inline-icon" />
                                </span>
                                <span>
                                    <strong>Locked:</strong> This section is in review.
                                    Only editors and admins can approve or request changes.
                                </span>
                            </div>
                        )}

                        <div className="adm-section-actions">
                            <WorkflowActions
                                type="section"
                                id={section.id}
                                status={section.status as WorkflowStatus}
                                onSuccess={onRefresh}
                            />
                        </div>

                        {!isLocked && (
                            <div className="adm-section-edit-bar">
                                {schema && !isPublished && (
                                    <Button
                                        variant="edit"
                                        onClick={openEditor}
                                    >
                                        <img src="/icons/web_studio.svg" alt="" className="adm-inline-icon" /> Edit blocks
                                    </Button>
                                )}
                                {!isPublished && (
                                    <Button
                                        variant="danger"
                                        onClick={handleDelete}
                                        loading={deleting}
                                        loadingText={<><img src="/icons/data_recycle.svg" alt="" className="adm-inline-icon" /> Deleting…</>}
                                    >
                                        <img src="/icons/data_recycle.svg" alt="" className="adm-inline-icon" /> Delete section
                                    </Button>
                                )}
                                {deleteErr && (
                                    <span className="adm-form-error">{deleteErr}</span>
                                )}
                            </div>
                        )}

                        {/* ── Styling sub-section ── */}
                        <div className="adm-section-styling">
                            <Button
                                type="button"
                                className="adm-toggle-btn"
                                onClick={() => setStylingOpen(o => !o)}
                            >
                                <span className="adm-toggle-btn__chevron">{stylingOpen ? '▲' : '▼'}</span>
                                Styling
                            </Button>
                            {stylingOpen && (
                                <form onSubmit={handleSaveStyling} className="adm-styling-form">
                                    {stylingSuccess && (
                                        <div className="adm-success-banner adm-success-banner--sm">{stylingSuccess}</div>
                                    )}
                                    {stylingError && (
                                        <div className="adm-error-banner adm-error-banner--sm">{stylingError}</div>
                                    )}
                                    <div className="adm-field">
                                        <label className="adm-label">Background Image URL</label>
                                        <input
                                            className="adm-input"
                                            type="url"
                                            value={bgImageUrl}
                                            onChange={e => setBgImageUrl(e.target.value)}
                                            placeholder="https://… (leave blank for default background)"
                                            disabled={isLocked}
                                        />
                                        <p className="adm-field-hint">
                                            Full-bleed cover image behind this section. A dark overlay is added automatically for text legibility.
                                        </p>
                                    </div>
                                    <div className="adm-field">
                                        <label className="adm-label">Extra CSS Classes</label>
                                        <input
                                            className="adm-input"
                                            value={cssClasses}
                                            onChange={e => setCssClasses(e.target.value)}
                                            placeholder="e.g. pt-24 pb-24 text-center"
                                            disabled={isLocked}
                                        />
                                        <p className="adm-field-hint">
                                            Space-separated utility classes appended to the section wrapper.
                                        </p>
                                    </div>
                                    {!isLocked && (
                                        <div className="adm-styling-form__footer">
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                loading={stylingSaving}
                                                loadingText="Saving…"
                                            >
                                                Save Styling
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>

                        {section.blocks && section.blocks.length > 0 && (
                            <div className="adm-section-blocks">
                                <div className="adm-section-blocks__title">Blocks</div>
                                {section.blocks.map((block, i) => (
                                    <div key={block.id} className="adm-block-row">
                                        <span className="adm-block-row__pos">{i + 1}</span>
                                        <span className="adm-block-row__type">{block.type}</span>
                                        <WorkflowBadge status={block.status as WorkflowStatus} size="sm" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="adm-section-meta">
                            <div><strong>Position:</strong> {section.ordering_position}</div>
                            <div>
                                <strong>ID:</strong>{' '}
                                <code className="adm-section-id-code">{section.id.slice(0, 8)}…</code>
                            </div>
                            {section.published_at && (
                                <div>
                                    <strong>Published:</strong>{' '}
                                    {new Date(section.published_at).toLocaleDateString()}
                                </div>
                            )}
                        </div>

                        <Button
                            className="adm-toggle-btn"
                            onClick={() => setAuditOpen(o => !o)}
                        >
                            <span className="adm-toggle-btn__chevron">{auditOpen ? '▲' : '▼'}</span>
                            Audit Trail
                        </Button>
                        {auditOpen && (
                            <div className="adm-section-audit-body">
                                <AuditTrail type="section" id={section.id} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {composerOpen && schema && (
                <SectionComposerModal
                    schema={schema}
                    pageId={pageId}
                    section={fullSection ?? undefined}
                    onSuccess={() => { setComposerOpen(false); onRefresh(); }}
                    onClose={() => setComposerOpen(false)}
                />
            )}
        </>
    );
}

// ─── Page Settings Panel ──────────────────────────────────────────────────

interface PageSettingsPanelProps {
    page:      AdminPage;
    allPages:  AdminPage[];
    onSaved:   (page: AdminPage) => void;
}

function PageSettingsPanel({ page, allPages, onSaved }: PageSettingsPanelProps) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    // ── form state ──
    const [slug,                    setSlug]                   = useState(page.slug);
    const [siteScopeVal,            setSiteScopeVal]           = useState(page.site_scope);
    const [identityTitleEn,         setIdentityTitleEn]        = useState(page.identity_title?.en ?? '');
    const [identityPurposeEn,       setIdentityPurposeEn]      = useState(page.identity_purpose?.en ?? '');
    const [identityOwner,           setIdentityOwner]          = useState(page.identity_owner ?? '');
    const [identityCanonicalUrl,    setIdentityCanonicalUrl]   = useState(page.identity_canonical_url ?? '');
    const [identityClassification,  setIdentityClassification] = useState<string>(page.identity_classification ?? '');
    const [parentId,                setParentId]               = useState(page.parent_id ?? '');
    const [hierarchyDepth,          setHierarchyDepth]         = useState(String(page.hierarchy_depth ?? 0));
    const [hierarchyPosition,       setHierarchyPosition]      = useState(String(page.hierarchy_position ?? 0));
    const [hierarchyIncludeInNav,   setHierarchyIncludeInNav]  = useState(page.hierarchy_include_in_nav);
    const [hierarchyNavLabelEn,     setHierarchyNavLabelEn]    = useState(page.hierarchy_nav_label?.en ?? '');
    const [compositionSectionOrder, setCompositionSectionOrder] = useState(page.composition_section_order ?? '');
    const [compositionAllowDynamic, setCompositionAllowDynamic] = useState(page.composition_allow_dynamic);
    const [compositionMaxSections,  setCompositionMaxSections]  = useState(page.composition_max_sections != null ? String(page.composition_max_sections) : '');
    const [compositionFallback,     setCompositionFallback]    = useState(page.composition_fallback_policy ?? '');
    const [metaSeoTitleEn,          setMetaSeoTitleEn]         = useState(page.meta_seo_title?.en ?? '');
    const [metaSeoDescEn,           setMetaSeoDescEn]          = useState(page.meta_seo_description?.en ?? '');
    const [metaOgTitleEn,           setMetaOgTitleEn]          = useState(page.meta_og_title?.en ?? '');
    const [metaOgDescEn,            setMetaOgDescEn]           = useState(page.meta_og_description?.en ?? '');
    const [metaRobots,              setMetaRobots]             = useState(page.meta_robots ?? '');
    const [metaSchema,              setMetaSchema]             = useState(page.meta_schema_markup ?? '');
    const [metaOgImageUrl,          setMetaOgImageUrl]         = useState((page.meta_og_image as { url?: string } | null)?.url ?? '');
    const [metaHreflangEn,          setMetaHreflangEn]         = useState(page.meta_hreflang?.en ?? '');

    const fieldErr = (key: string) => fieldErrors[key]?.[0] ?? null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setGlobalError(null);
        setFieldErrors({});
        setSuccessMsg(null);

        const payload: UpdatePagePayload = {
            slug: slug || undefined,
            site_scope: siteScopeVal || undefined,
            identity_title:         identityTitleEn       ? { en: identityTitleEn       } : undefined,
            identity_purpose:       identityPurposeEn     ? { en: identityPurposeEn     } : undefined,
            identity_owner:         identityOwner         || undefined,
            identity_canonical_url: identityCanonicalUrl  || undefined,
            identity_classification: (identityClassification as 'public' | 'restricted') || undefined,
            parent_id:              parentId || null,
            hierarchy_depth:        parseInt(hierarchyDepth, 10),
            hierarchy_position:     parseInt(hierarchyPosition, 10),
            hierarchy_include_in_nav: hierarchyIncludeInNav,
            hierarchy_nav_label:    hierarchyNavLabelEn ? { en: hierarchyNavLabelEn } : undefined,
            composition_section_order:   compositionSectionOrder   || undefined,
            composition_allow_dynamic:   compositionAllowDynamic,
            composition_max_sections:    compositionMaxSections ? parseInt(compositionMaxSections, 10) : null,
            composition_fallback_policy: compositionFallback       || undefined,
            meta_seo_title:         metaSeoTitleEn  ? { en: metaSeoTitleEn  } : undefined,
            meta_seo_description:   metaSeoDescEn   ? { en: metaSeoDescEn   } : undefined,
            meta_og_title:          metaOgTitleEn   ? { en: metaOgTitleEn   } : undefined,
            meta_og_description:    metaOgDescEn    ? { en: metaOgDescEn    } : undefined,
            meta_robots:            metaRobots       || undefined,
            meta_schema_markup:     metaSchema       || undefined,
            meta_og_image:          metaOgImageUrl ? { url: metaOgImageUrl } : undefined,
            meta_hreflang:          metaHreflangEn ? { en: metaHreflangEn } : undefined,
        };

        try {
            const updated = await updatePage(page.id, payload);
            setSuccessMsg('Settings saved successfully.');
            setTimeout(() => setSuccessMsg(null), 4000);
            onSaved(updated);
        } catch (err) {
            if (err instanceof ValidationError) {
                setFieldErrors(err.fieldErrors);
                setGlobalError('Please fix the validation errors below.');
            } else {
                setGlobalError(err instanceof Error ? err.message : 'Save failed');
            }
        } finally {
            setSaving(false);
        }
    };

    const otherPages = allPages.filter(p => p.id !== page.id);

    return (
        <div className="adm-settings-accordion">
            <Button
                className="adm-toggle-btn adm-settings-accordion__toggle"
                onClick={() => setOpen(o => !o)}
                type="button"
            >
                <span className="adm-toggle-btn__chevron">{open ? '▲' : '▼'}</span>
                Page Settings
            </Button>

            {open && (
                <form onSubmit={handleSave} className="adm-settings-form">
                    {successMsg && (
                        <div className="adm-success-banner adm-success-banner--sm">{successMsg}</div>
                    )}
                    {globalError && (
                        <div className="adm-error-banner adm-error-banner--sm">{globalError}</div>
                    )}

                    {/* ── Core Info ── */}
                    <div className="adm-settings-group">
                        <div className="adm-settings-group__title">Core Info</div>

                        <div className="adm-field-row">
                            <div className="adm-field">
                                <label className="adm-label">Slug</label>
                                <input
                                    className={`adm-input${fieldErr('slug') ? ' adm-input--error' : ''}`}
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                />
                                {fieldErr('slug') && <p className="adm-field-error">{fieldErr('slug')}</p>}
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Site Scope</label>
                                <input
                                    className={`adm-input${fieldErr('site_scope') ? ' adm-input--error' : ''}`}
                                    value={siteScopeVal}
                                    onChange={e => setSiteScopeVal(e.target.value)}
                                />
                                {fieldErr('site_scope') && <p className="adm-field-error">{fieldErr('site_scope')}</p>}
                            </div>
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Type</label>
                            <input className="adm-input adm-input--readonly" value={page.type} readOnly />
                            <p className="adm-field-hint">Page type is immutable after creation.</p>
                        </div>
                    </div>

                    {/* ── Identity ── */}
                    <div className="adm-settings-group">
                        <div className="adm-settings-group__title">Page Identity</div>

                        <div className="adm-field">
                            <label className="adm-label">Title (EN)</label>
                            <input
                                className="adm-input"
                                value={identityTitleEn}
                                onChange={e => setIdentityTitleEn(e.target.value)}
                                placeholder="Title in English"
                            />
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Purpose (EN)</label>
                            <textarea
                                className="adm-input adm-textarea"
                                value={identityPurposeEn}
                                onChange={e => setIdentityPurposeEn(e.target.value)}
                                rows={2}
                                placeholder="Brief description of this page's purpose"
                            />
                        </div>

                        <div className="adm-field-row">
                            <div className="adm-field">
                                <label className="adm-label">Owner</label>
                                <input
                                    className="adm-input"
                                    value={identityOwner}
                                    onChange={e => setIdentityOwner(e.target.value)}
                                    placeholder="e.g. editorial"
                                />
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Classification</label>
                                <select
                                    className="adm-input"
                                    value={identityClassification}
                                    onChange={e => setIdentityClassification(e.target.value)}
                                >
                                    <option value="">— unset —</option>
                                    <option value="public">public</option>
                                    <option value="restricted">restricted</option>
                                </select>
                            </div>
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Canonical URL</label>
                            <input
                                className={`adm-input${fieldErr('identity_canonical_url') ? ' adm-input--error' : ''}`}
                                value={identityCanonicalUrl}
                                onChange={e => setIdentityCanonicalUrl(e.target.value)}
                                placeholder="https://…"
                            />
                            {fieldErr('identity_canonical_url') && (
                                <p className="adm-field-error">{fieldErr('identity_canonical_url')}</p>
                            )}
                        </div>
                    </div>

                    {/* ── Hierarchy ── */}
                    <div className="adm-settings-group">
                        <div className="adm-settings-group__title">Page Hierarchy</div>

                        <div className="adm-field">
                            <label className="adm-label">Parent Page</label>
                            <select
                                className={`adm-input${fieldErr('parent_id') ? ' adm-input--error' : ''}`}
                                value={parentId}
                                onChange={e => setParentId(e.target.value)}
                            >
                                <option value="">— none (root) —</option>
                                {otherPages.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.identity_title?.en ?? p.slug} ({p.slug})
                                    </option>
                                ))}
                            </select>
                            {fieldErr('parent_id') && <p className="adm-field-error">{fieldErr('parent_id')}</p>}
                        </div>

                        <div className="adm-field-row">
                            <div className="adm-field">
                                <label className="adm-label">Depth (0–2)</label>
                                <input
                                    className={`adm-input${fieldErr('hierarchy_depth') ? ' adm-input--error' : ''}`}
                                    type="number" min={0} max={2}
                                    value={hierarchyDepth}
                                    onChange={e => setHierarchyDepth(e.target.value)}
                                />
                                {fieldErr('hierarchy_depth') && <p className="adm-field-error">{fieldErr('hierarchy_depth')}</p>}
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Position</label>
                                <input
                                    className="adm-input"
                                    type="number" min={0}
                                    value={hierarchyPosition}
                                    onChange={e => setHierarchyPosition(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="adm-field adm-field--check">
                            <label className="adm-check-label">
                                <input
                                    type="checkbox"
                                    checked={hierarchyIncludeInNav}
                                    onChange={e => setHierarchyIncludeInNav(e.target.checked)}
                                />
                                Include in navigation
                            </label>
                        </div>

                        {hierarchyIncludeInNav && (
                            <div className="adm-field">
                                <label className="adm-label">Nav Label (EN)</label>
                                <input
                                    className="adm-input"
                                    value={hierarchyNavLabelEn}
                                    onChange={e => setHierarchyNavLabelEn(e.target.value)}
                                    placeholder="Label shown in navigation"
                                />
                            </div>
                        )}
                    </div>

                    {/* ── Composition Policy ── */}
                    <div className="adm-settings-group">
                        <div className="adm-settings-group__title">Composition Policy</div>

                        <div className="adm-field-row">
                            <div className="adm-field">
                                <label className="adm-label">Section Order</label>
                                <input
                                    className="adm-input"
                                    value={compositionSectionOrder}
                                    onChange={e => setCompositionSectionOrder(e.target.value)}
                                    placeholder="e.g. fixed"
                                />
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Fallback Policy</label>
                                <input
                                    className="adm-input"
                                    value={compositionFallback}
                                    onChange={e => setCompositionFallback(e.target.value)}
                                    placeholder="e.g. show_partial"
                                />
                            </div>
                        </div>

                        <div className="adm-field-row">
                            <div className="adm-field">
                                <label className="adm-label">Max Sections</label>
                                <input
                                    className={`adm-input${fieldErr('composition_max_sections') ? ' adm-input--error' : ''}`}
                                    type="number" min={1}
                                    value={compositionMaxSections}
                                    onChange={e => setCompositionMaxSections(e.target.value)}
                                    placeholder="Unlimited"
                                />
                                {fieldErr('composition_max_sections') && (
                                    <p className="adm-field-error">{fieldErr('composition_max_sections')}</p>
                                )}
                            </div>
                            <div className="adm-field adm-field--check adm-field--check-mid">
                                <label className="adm-check-label">
                                    <input
                                        type="checkbox"
                                        checked={compositionAllowDynamic}
                                        onChange={e => setCompositionAllowDynamic(e.target.checked)}
                                    />
                                    Allow dynamic sections
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* ── Meta / SEO ── */}
                    <div className="adm-settings-group">
                        <div className="adm-settings-group__title">Meta / SEO</div>

                        <div className="adm-field-row">
                            <div className="adm-field">
                                <label className="adm-label">SEO Title (EN)</label>
                                <input
                                    className="adm-input"
                                    value={metaSeoTitleEn}
                                    onChange={e => setMetaSeoTitleEn(e.target.value)}
                                    placeholder="Title for search engines"
                                />
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">OG Title (EN)</label>
                                <input
                                    className="adm-input"
                                    value={metaOgTitleEn}
                                    onChange={e => setMetaOgTitleEn(e.target.value)}
                                    placeholder="Open Graph title"
                                />
                            </div>
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">SEO Description (EN)</label>
                            <textarea
                                className="adm-input adm-textarea"
                                value={metaSeoDescEn}
                                onChange={e => setMetaSeoDescEn(e.target.value)}
                                rows={2}
                                placeholder="Meta description (max ~160 chars)"
                            />
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">OG Description (EN)</label>
                            <textarea
                                className="adm-input adm-textarea"
                                value={metaOgDescEn}
                                onChange={e => setMetaOgDescEn(e.target.value)}
                                rows={2}
                                placeholder="Open Graph description"
                            />
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">OG Image URL</label>
                            <input
                                className="adm-input"
                                value={metaOgImageUrl}
                                onChange={e => setMetaOgImageUrl(e.target.value)}
                                placeholder="https://… (Open Graph cover image)"
                            />
                        </div>

                        <div className="adm-field-row">
                            <div className="adm-field">
                                <label className="adm-label">Robots</label>
                                <input
                                    className="adm-input"
                                    value={metaRobots}
                                    onChange={e => setMetaRobots(e.target.value)}
                                    placeholder="e.g. index,follow"
                                />
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Schema Markup</label>
                                <input
                                    className="adm-input"
                                    value={metaSchema}
                                    onChange={e => setMetaSchema(e.target.value)}
                                    placeholder="e.g. Organization"
                                />
                            </div>
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Hreflang — EN URL</label>
                            <input
                                className="adm-input"
                                value={metaHreflangEn}
                                onChange={e => setMetaHreflangEn(e.target.value)}
                                placeholder="https://… (canonical EN hreflang URL)"
                            />
                        </div>
                    </div>

                    <div className="adm-settings-form__footer">
                        <Button type="submit" variant="primary" loading={saving} loadingText="Saving…">
                            Save Settings
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}

// ─── Main view ────────────────────────────────────────────────────────────

export default function PageDetailView() {
    const { id }   = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [page,     setPage]     = useState<AdminPage | null>(null);
    const [sections, setSections] = useState<AdminSection[]>([]);
    const [allPages, setAllPages] = useState<AdminPage[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState<string | null>(null);
    const [auditOpen, setAuditOpen] = useState(false);

    const [pickerOpen,  setPickerOpen]  = useState(false);
    const [chosenSchema, setChosenSchema] = useState<SectionTypeSchema | null>(null);

    const load = useCallback(() => {
        if (!id) return;
        setLoading(true);
        Promise.all([
            fetchPage(id),
            fetchSections({ page_id: id }),
            fetchPages({ per_page: '200' }),
        ])
            .then(([p, s, ap]) => {
                setPage(p);
                setSections(s.data.sort((a, b) => a.ordering_position - b.ordering_position));
                setAllPages(ap.data);
            })
            .catch(e => setError(e instanceof Error ? e.message : 'Failed to load page'))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => { load(); }, [load]);

    if (loading) return <div className="adm-load-state">Loading…</div>;
    if (error)   return <div className="adm-error-banner">{error}</div>;
    if (!page)   return null;

    const handleTypeSelected = (schema: SectionTypeSchema) => {
        setPickerOpen(false);
        setChosenSchema(schema);
    };

    return (
        <div>
            <div className="adm-breadcrumb">
                <Button className="adm-breadcrumb__link" onClick={() => navigate('/admin/pages')}>
                    Pages
                </Button>
                <span className="adm-breadcrumb__sep">›</span>
                <span className="adm-breadcrumb__current">{pageTitle(page)}</span>
            </div>

            <div className="adm-detail-card">
                <div className="adm-detail-header">
                    <div>
                        <div className="adm-detail-title-row">
                            <h1 className="adm-detail-title">{pageTitle(page)}</h1>
                            <WorkflowBadge status={page.status as WorkflowStatus} />
                        </div>
                        <div className="adm-detail-meta">
                            <span>/{page.slug}</span>
                            <span className="adm-detail-meta__dot">·</span>
                            <span className="adm-detail-meta__mono">{page.type}</span>
                            <span className="adm-detail-meta__dot">·</span>
                            <span>{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
                            {page.published_at && (
                                <>
                                    <span className="adm-detail-meta__dot">·</span>
                                    <span>Published {new Date(page.published_at).toLocaleDateString()}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <a
                        href={`/${page.slug === 'home' ? '' : page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="adm-preview-link"
                    >
                        Preview ↗
                    </a>
                </div>

                {page.status === 'in_review' && (
                    <div className="adm-lock-notice">
                        <span className="adm-lock-notice__icon">
                            <img src="/icons/sign.svg" alt="" className="adm-inline-icon" />
                        </span>
                        <span>
                            <strong>Locked:</strong> This page is in review.
                            Only editors and admins can approve or request changes.
                        </span>
                    </div>
                )}

                <div className="adm-detail-actions">
                    <WorkflowActions
                        type="page"
                        id={page.id}
                        status={page.status as WorkflowStatus}
                        onSuccess={() => load()}
                    />
                </div>

                {/* Settings accordion */}
                <div className="adm-detail-settings-wrap">
                    <PageSettingsPanel
                        page={page}
                        allPages={allPages}
                        onSaved={updated => setPage(updated)}
                    />
                </div>

                <div className="adm-detail-audit-wrap">
                    <Button
                        className="adm-toggle-btn"
                        onClick={() => setAuditOpen(o => !o)}
                    >
                        <span className="adm-toggle-btn__chevron">{auditOpen ? '▲' : '▼'}</span>
                        Page Audit Trail
                    </Button>
                    {auditOpen && (
                        <div className="adm-detail-audit-body">
                            <AuditTrail type="page" id={page.id} />
                        </div>
                    )}
                </div>
            </div>

            {/* Sections list */}
            <div>
                <div className="adm-section-heading">
                    <h2 className="adm-section-heading__title">
                        Sections{' '}
                        <span className="adm-section-heading__count">({sections.length})</span>
                    </h2>
                    <Button
                        variant="primary"
                        onClick={() => setPickerOpen(true)}
                    >
                        + Add section
                    </Button>
                </div>

                {sections.length === 0 ? (
                    <div className="adm-sections-empty">
                        No sections yet.{' '}
                        <Button
                            className="adm-view-all-btn"
                            onClick={() => setPickerOpen(true)}
                        >
                            Add the first one →
                        </Button>
                    </div>
                ) : (
                    sections.map(section => (
                        <SectionPanel
                            key={section.id}
                            section={section}
                            pageId={page.id}
                            onRefresh={load}
                        />
                    ))
                )}
            </div>

            {pickerOpen && (
                <SectionTypePickerModal
                    onSelect={handleTypeSelected}
                    onClose={() => setPickerOpen(false)}
                />
            )}

            {chosenSchema && (
                <SectionComposerModal
                    schema={chosenSchema}
                    pageId={page.id}
                    position={sections.length}
                    onSuccess={() => { setChosenSchema(null); load(); }}
                    onClose={() => setChosenSchema(null)}
                />
            )}
        </div>
    );
}
