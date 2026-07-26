import React, { useEffect, useState, useCallback } from 'react';
import type { AdminPage, WorkflowStatus } from '../types';
import { fetchPages, createPage, ValidationError } from '../api/adminClient';
import Button from '../components/Button';
import type { CreatePagePayload } from '../api/adminClient';
import WorkflowBadge from '../components/WorkflowBadge';
import { useNavigate } from 'react-router-dom';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '',          label: 'All Statuses' },
  { value: 'draft',     label: 'Draft'        },
  { value: 'in_review', label: 'In Review'    },
  { value: 'approved',  label: 'Approved'     },
  { value: 'published', label: 'Published'    },
  { value: 'archived',  label: 'Archived'     },
];

const PAGE_TYPES = [
  'corporate.index',
  'corporate.platform',
  'corporate.about',
  'corporate.contact',
  'corporate.legal',
  'editorial',
  'utility',
  'newsroom.article',
  'newsroom.overview',
  'newsroom.news',
  'newsroom.stories',
  'newsroom.about',
];

function pageTitle(page: AdminPage): string {
  if (!page.identity_title) return page.slug;
  const t = page.identity_title;
  return t['en'] ?? Object.values(t)[0] ?? page.slug;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Create Page Modal ────────────────────────────────────────────────────

interface CreatePageModalProps {
  onSuccess: (page: AdminPage) => void;
  onClose:   () => void;
}

const ACTOR_ID = '00000000-0000-0000-0000-000000000001';

function CreatePageModal({ onSuccess, onClose }: CreatePageModalProps) {
  const [form, setForm] = useState({
    slug:                     '',
    type:                     'corporate.about',
    site_scope:               'main',
    identity_title_en:        '',
    identity_purpose_en:      '',
    identity_owner:           'editorial',
    identity_canonical_url:   '',
    hierarchy_depth:          '0',
    hierarchy_position:       '0',
    hierarchy_include_in_nav: false,
    composition_allow_dynamic: false,
    meta_seo_title_en:        '',
    meta_seo_description_en:  '',
    meta_og_image_url:        '',
    meta_hreflang_en:         '',
  });

  const [saving,      setSaving]      = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const set = (key: string, value: string | boolean) =>
    setForm(f => ({ ...f, [key]: value }));

  const fieldErr = (key: string) => fieldErrors[key]?.[0] ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setGlobalError(null);
    setFieldErrors({});

    const payload: CreatePagePayload = {
      slug:       form.slug,
      type:       form.type,
      site_scope: form.site_scope,
      identity_title:       form.identity_title_en   ? { en: form.identity_title_en   } : undefined,
      identity_purpose:     form.identity_purpose_en ? { en: form.identity_purpose_en } : undefined,
      identity_owner:       form.identity_owner       || undefined,
      identity_canonical_url: form.identity_canonical_url || undefined,
      hierarchy_depth:      parseInt(form.hierarchy_depth, 10),
      hierarchy_position:   parseInt(form.hierarchy_position, 10),
      hierarchy_include_in_nav: form.hierarchy_include_in_nav,
      composition_allow_dynamic: form.composition_allow_dynamic,
      meta_seo_title:       form.meta_seo_title_en       ? { en: form.meta_seo_title_en       } : undefined,
      meta_seo_description: form.meta_seo_description_en ? { en: form.meta_seo_description_en } : undefined,
      meta_og_image:        form.meta_og_image_url ? { url: form.meta_og_image_url } : undefined,
      meta_hreflang:        form.meta_hreflang_en  ? { en: form.meta_hreflang_en  } : undefined,
    };

    try {
      const page = await createPage(payload);
      onSuccess(page);
    } catch (err) {
      if (err instanceof ValidationError) {
        setFieldErrors(err.fieldErrors);
        setGlobalError('Please fix the validation errors below.');
      } else {
        setGlobalError(err instanceof Error ? err.message : 'Failed to create page');
      }
      setSaving(false);
    }
  };

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>
        <div className="adm-modal__header">
          <div>
            <h2 className="adm-modal__title">Create Page</h2>
            <p className="adm-modal__subtitle">Set up a new page in the system.</p>
          </div>
          <button className="adm-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="adm-modal__body adm-settings-body">
            {globalError && (
              <div className="adm-error-banner adm-error-banner--sm">{globalError}</div>
            )}

            <div className="adm-settings-group">
              <div className="adm-settings-group__title">Core</div>

              <div className="adm-field">
                <label className="adm-label">Slug <span className="adm-required">*</span></label>
                <input
                  className={`adm-input${fieldErr('slug') ? ' adm-input--error' : ''}`}
                  value={form.slug}
                  onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="e.g. about-us"
                  required
                />
                {fieldErr('slug') && <p className="adm-field-error">{fieldErr('slug')}</p>}
              </div>

              <div className="adm-field">
                <label className="adm-label">Type <span className="adm-required">*</span></label>
                <select
                  className={`adm-input${fieldErr('type') ? ' adm-input--error' : ''}`}
                  value={form.type}
                  onChange={e => set('type', e.target.value)}
                  required
                >
                  {PAGE_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {fieldErr('type') && <p className="adm-field-error">{fieldErr('type')}</p>}
              </div>

              <div className="adm-field">
                <label className="adm-label">Site Scope <span className="adm-required">*</span></label>
                <input
                  className={`adm-input${fieldErr('site_scope') ? ' adm-input--error' : ''}`}
                  value={form.site_scope}
                  onChange={e => set('site_scope', e.target.value)}
                  placeholder="e.g. main"
                  required
                />
                {fieldErr('site_scope') && <p className="adm-field-error">{fieldErr('site_scope')}</p>}
              </div>
            </div>

            <div className="adm-settings-group">
              <div className="adm-settings-group__title">Identity</div>

              <div className="adm-field">
                <label className="adm-label">Title (EN)</label>
                <input
                  className="adm-input"
                  value={form.identity_title_en}
                  onChange={e => set('identity_title_en', e.target.value)}
                  placeholder="Page title in English"
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">Purpose (EN)</label>
                <textarea
                  className="adm-input adm-textarea"
                  value={form.identity_purpose_en}
                  onChange={e => set('identity_purpose_en', e.target.value)}
                  placeholder="Brief description of this page's purpose"
                  rows={2}
                />
              </div>

              <div className="adm-field-row">
                <div className="adm-field">
                  <label className="adm-label">Owner</label>
                  <input
                    className="adm-input"
                    value={form.identity_owner}
                    onChange={e => set('identity_owner', e.target.value)}
                    placeholder="e.g. editorial"
                  />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Canonical URL</label>
                  <input
                    className="adm-input"
                    value={form.identity_canonical_url}
                    onChange={e => set('identity_canonical_url', e.target.value)}
                    placeholder="https://…"
                  />
                </div>
              </div>
            </div>

            <div className="adm-settings-group">
              <div className="adm-settings-group__title">Hierarchy</div>

              <div className="adm-field-row">
                <div className="adm-field">
                  <label className="adm-label">Depth (0–2)</label>
                  <input
                    className={`adm-input${fieldErr('hierarchy_depth') ? ' adm-input--error' : ''}`}
                    type="number" min={0} max={2}
                    value={form.hierarchy_depth}
                    onChange={e => set('hierarchy_depth', e.target.value)}
                  />
                  {fieldErr('hierarchy_depth') && <p className="adm-field-error">{fieldErr('hierarchy_depth')}</p>}
                </div>
                <div className="adm-field">
                  <label className="adm-label">Position</label>
                  <input
                    className="adm-input"
                    type="number" min={0}
                    value={form.hierarchy_position}
                    onChange={e => set('hierarchy_position', e.target.value)}
                  />
                </div>
              </div>

              <div className="adm-field adm-field--check">
                <label className="adm-check-label">
                  <input
                    type="checkbox"
                    checked={form.hierarchy_include_in_nav}
                    onChange={e => set('hierarchy_include_in_nav', e.target.checked)}
                  />
                  Include in navigation
                </label>
              </div>
            </div>

            <div className="adm-settings-group">
              <div className="adm-settings-group__title">Composition</div>
              <div className="adm-field adm-field--check">
                <label className="adm-check-label">
                  <input
                    type="checkbox"
                    checked={form.composition_allow_dynamic}
                    onChange={e => set('composition_allow_dynamic', e.target.checked)}
                  />
                  Allow dynamic sections
                </label>
              </div>
            </div>

            <div className="adm-settings-group">
              <div className="adm-settings-group__title">SEO / Meta</div>

              <div className="adm-field">
                <label className="adm-label">SEO Title (EN)</label>
                <input
                  className="adm-input"
                  value={form.meta_seo_title_en}
                  onChange={e => set('meta_seo_title_en', e.target.value)}
                  placeholder="Page title for search engines"
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">SEO Description (EN)</label>
                <textarea
                  className="adm-input adm-textarea"
                  value={form.meta_seo_description_en}
                  onChange={e => set('meta_seo_description_en', e.target.value)}
                  placeholder="Meta description (max ~160 chars)"
                  rows={2}
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">OG Image URL</label>
                <input
                  className="adm-input"
                  value={form.meta_og_image_url}
                  onChange={e => set('meta_og_image_url', e.target.value)}
                  placeholder="https://… (Open Graph cover image)"
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">Hreflang — EN URL</label>
                <input
                  className="adm-input"
                  value={form.meta_hreflang_en}
                  onChange={e => set('meta_hreflang_en', e.target.value)}
                  placeholder="https://… (canonical EN hreflang URL)"
                />
              </div>
            </div>

            <div className="adm-settings-group">
              <div className="adm-settings-group__title">Authoring</div>
              <p className="adm-field-hint" style={{ margin: 0 }}>
                <strong>Created by</strong> and <strong>last modified by</strong> are set automatically from your authenticated session. The page will be created in <strong>draft</strong> status.
              </p>
            </div>
          </div>

          <div className="adm-modal__footer">
            <Button variant="ghost" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving} loadingText="Creating…">
              Create Page
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────

export default function PagesView() {
  const navigate = useNavigate();
  const [pages,       setPages]       = useState<AdminPage[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [filter,      setFilter]      = useState('');
  const [search,      setSearch]      = useState('');
  const [createOpen,  setCreateOpen]  = useState(false);
  const [successMsg,  setSuccessMsg]  = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = { per_page: '200', not_type: 'newsroom.article' };
    if (filter) params.status = filter;
    fetchPages(params)
      .then(res => setPages(res.data))
      .catch(e  => setError(e instanceof Error ? e.message : 'Failed to load pages'))
      .finally(()=> setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleCreated = (page: AdminPage) => {
    setCreateOpen(false);
    setSuccessMsg(`Page "${page.slug}" created successfully.`);
    setTimeout(() => setSuccessMsg(null), 4000);
    load();
    navigate(`/admin/pages/${page.id}`);
  };

  const displayed = pages.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return pageTitle(p).toLowerCase().includes(q) || p.slug.includes(q);
  });

  const counts = STATUS_FILTERS.slice(1).reduce<Record<string, number>>((acc, f) => {
    acc[f.value] = pages.filter(p => p.status === f.value).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Pages</h1>
          <p className="adm-page-subtitle">Manage and publish content pages through the authoring workflow.</p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          + Create Page
        </Button>
      </div>

      {successMsg && (
        <div className="adm-success-banner">{successMsg}</div>
      )}

      <div className="adm-filter-bar">
        {STATUS_FILTERS.map(f => (
          <Button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`adm-filter-btn adm-filter-btn--${filter === f.value ? 'on' : 'off'}`}
          >
            {f.label}
            {f.value && counts[f.value] > 0 && (
              <span className="adm-filter-btn__count">{counts[f.value]}</span>
            )}
          </Button>
        ))}
      </div>

      <div className="adm-search">
        <input
          className="adm-search__input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search pages…"
        />
      </div>

      {loading && <div className="adm-load-state">Loading pages…</div>}
      {error   && <div className="adm-error-banner">{error}</div>}

      {!loading && !error && (
        <div className="adm-table">
          <div className="adm-table__head">
            {['Page', 'Type', 'Status', 'Updated', 'Actions'].map(h => (
              <span key={h} className="adm-table__head-cell">{h}</span>
            ))}
          </div>

          {displayed.length === 0 ? (
            <div className="adm-table__empty">
              {search ? 'No pages match your search.' : 'No pages found.'}
            </div>
          ) : displayed.map(page => (
            <div key={page.id} className="adm-table__row">
              <div>
                <div className="adm-table__cell-title">{pageTitle(page)}</div>
                <div className="adm-table__cell-slug">/{page.slug}</div>
              </div>
              <div>
                <span className="adm-type-chip">{page.type}</span>
              </div>
              <div>
                <WorkflowBadge status={page.status as WorkflowStatus} size="sm" />
              </div>
              <div className="adm-table__cell-date">{fmtDate(page.updated_at)}</div>
              <div>
                <Button
                  className="adm-open-btn"
                  onClick={() => navigate(`/admin/pages/${page.id}`)}
                >
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <p className="adm-table__footer">
          Showing {displayed.length} of {pages.length} pages
        </p>
      )}

      {createOpen && (
        <CreatePageModal
          onSuccess={handleCreated}
          onClose={() => setCreateOpen(false)}
        />
      )}
    </div>
  );
}
