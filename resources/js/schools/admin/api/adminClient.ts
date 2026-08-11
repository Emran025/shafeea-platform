import type {
  AdminPage,
  AdminSection,
  AdminBlock,
  PaginatedResponse,
  StatusTransition,
  WorkflowResult,
  ObjectType,
} from '../types';
import type { AdminActor, AuthorRole } from '../types';

const TOKEN_KEY = 'acc_admin_token';

/**
 * Derives the school-scoped admin API base URL from the school code injected
 * by the Blade shell — mirrors the pattern used in EngineClient.ts.
 * Resolves to `/school/{code}/admin`.
 */
function getAdminBase(): string {
  const schoolCode =
    (window as any).__SCHOOL_DATA__?.code ||
    document.getElementById('app')?.dataset.schoolCode ||
    '';
  if (!schoolCode) {
    console.warn('[adminClient] No school code found — admin requests will fail.');
  }
  return `/school/${schoolCode}/admin`;
}

function headers(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export class ValidationError extends Error {
  fieldErrors: Record<string, string[]>;
  constructor(message: string, fieldErrors: Record<string, string[]>) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${getAdminBase()}${path}`, {
    ...options,
    headers: { ...headers(), ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as {
      error?: string;
      message?: string;
      errors?: Record<string, string[]>;
    };
    if (res.status === 422 && body.errors) {
      throw new ValidationError(body.message ?? 'Validation failed', body.errors);
    }
    throw new Error(body.error ?? body.message ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export interface LoginResult {
  token: string;
  actor: AdminActor;
  permissions: string[];
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const result = await request<LoginResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem(TOKEN_KEY, result.token);
  return result;
}

export async function fetchMe(): Promise<{ actor: AdminActor; permissions: string[] }> {
  return request<{ actor: AdminActor; permissions: string[] }>('/auth/me');
}

export async function logout(): Promise<void> {
  try {
    await request<void>('/auth/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  roles: AuthorRole[];
  active: boolean;
  topics: string[];
}

export function fetchAdminUsers(): Promise<AdminUserRow[]> {
  return request<AdminUserRow[]>('/users');
}

export function createAdminUser(payload: Omit<AdminUserRow, 'id'> & { password?: string }): Promise<{ id: string }> {
  return request<{ id: string }>('/users', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateAdminUser(id: string, payload: Omit<AdminUserRow, 'id'> & { password?: string }): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteAdminUser(id: string): Promise<void> {
  return request<void>(`/users/${id}`, { method: 'DELETE' });
}

export interface AdminTopicUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

export interface AdminTopicRow {
  id: string;
  name: string;
  desc: string;
  users: string[];
  articles: number;
  color: string;
}

export function fetchTopicsData(): Promise<{ topics: AdminTopicRow[]; users: AdminTopicUser[] }> {
  return request<{ topics: AdminTopicRow[]; users: AdminTopicUser[] }>('/topics');
}

export function createTopic(payload: Pick<AdminTopicRow, 'name' | 'desc' | 'users' | 'color'>): Promise<{ id: string }> {
  return request<{ id: string }>('/topics', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateTopic(id: string, payload: Pick<AdminTopicRow, 'name' | 'desc' | 'users' | 'color'>): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/topics/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteTopic(id: string): Promise<void> {
  return request<void>(`/topics/${id}`, { method: 'DELETE' });
}

export function fetchPermissionsMatrix(): Promise<{
  all_permissions: string[];
  role_permissions: Record<AuthorRole, string[]>;
}> {
  return request('/permissions/matrix');
}

export function updateRolePermissions(role: AuthorRole, permissions: string[]): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>('/permissions/matrix', {
    method: 'PUT',
    body: JSON.stringify({ role, permissions }),
  });
}

// ── Pages ──────────────────────────────────────────────────────────────────

export function fetchPages(params?: Record<string, string>): Promise<PaginatedResponse<AdminPage>> {
  const q = new URLSearchParams({ per_page: '100', ...(params ?? {}) });
  return request<PaginatedResponse<AdminPage>>(`/pages?${q}`);
}

export function fetchPage(id: string): Promise<AdminPage> {
  return request<AdminPage>(`/pages/${id}`);
}

export interface CreatePagePayload {
  slug:                         string;
  type:                         string;
  site_scope:                   string;
  identity_title?:              Record<string, string>;
  identity_purpose?:            Record<string, string>;
  identity_owner?:              string;
  identity_canonical_url?:      string;
  identity_classification?:     'public' | 'restricted';
  parent_id?:                   string | null;
  hierarchy_depth?:             number;
  hierarchy_position?:          number;
  hierarchy_include_in_nav?:    boolean;
  hierarchy_nav_label?:         Record<string, string>;
  composition_section_order?:   string;
  composition_allow_dynamic?:   boolean;
  composition_max_sections?:    number | null;
  composition_fallback_policy?: string;
  meta_seo_title?:              Record<string, string>;
  meta_seo_description?:        Record<string, string>;
  meta_og_title?:               Record<string, string>;
  meta_og_description?:         Record<string, string>;
  meta_og_image?:               Record<string, unknown> | null;
  meta_robots?:                 string;
  meta_schema_markup?:          string;
  meta_hreflang?:               Record<string, string>;
}

export type UpdatePagePayload = Omit<Partial<CreatePagePayload>, 'type'>;

export function createPage(payload: CreatePagePayload): Promise<AdminPage> {
  return request<AdminPage>('/pages', { method: 'POST', body: JSON.stringify(payload) });
}

export function updatePage(id: string, payload: UpdatePagePayload): Promise<AdminPage> {
  return request<AdminPage>(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deletePage(id: string): Promise<void> {
  return request<void>(`/pages/${id}`, { method: 'DELETE' });
}

// ── Sections ──────────────────────────────────────────────────────────────

export function fetchSections(params?: {
  page_id?: string;
  status?: string;
}): Promise<PaginatedResponse<AdminSection>> {
  const q = new URLSearchParams({ per_page: '100', ...(params ?? {}) });
  return request<PaginatedResponse<AdminSection>>(`/sections?${q}`);
}

export function fetchSection(id: string): Promise<AdminSection> {
  return request<AdminSection>(`/sections/${id}`);
}

export function deleteSection(id: string): Promise<void> {
  return request<void>(`/sections/${id}`, { method: 'DELETE' });
}

export interface UpdateSectionPayload {
  background_image_url?: string | null;
  custom_css_classes?:   string | null;
}

export function updateSection(id: string, payload: UpdateSectionPayload): Promise<AdminSection> {
  return request<AdminSection>(`/sections/${id}`, {
    method: 'PUT',
    body:   JSON.stringify(payload),
  });
}

// ── Section Compose (atomic create / replace-blocks) ──────────────────────

export interface BlockInput {
  type:   string;
  fields: Record<string, unknown>;
}

export interface ComposePayload {
  page_id?:           string;
  type?:              string;
  identity_name?:     string;
  ordering_position?: number;
  blocks:             BlockInput[];
}

export function composeSection(payload: ComposePayload): Promise<AdminSection> {
  return request<AdminSection>('/sections/compose', {
    method: 'POST',
    body:   JSON.stringify(payload),
  });
}

export function updateSectionCompose(
  sectionId: string,
  payload: Omit<ComposePayload, 'page_id' | 'type'>,
): Promise<AdminSection> {
  return request<AdminSection>(`/sections/${sectionId}/compose`, {
    method: 'PUT',
    body:   JSON.stringify(payload),
  });
}

// ── Blocks ────────────────────────────────────────────────────────────────

export function fetchBlock(id: string): Promise<AdminBlock> {
  return request<AdminBlock>(`/blocks/${id}`);
}

// ── Workflow transitions ───────────────────────────────────────────────────

export function workflowSubmit(type: ObjectType, id: string): Promise<WorkflowResult> {
  return request<WorkflowResult>(`/workflow/${type}/${id}/submit`, { method: 'POST' });
}

export function workflowRequestChanges(
  type: ObjectType,
  id: string,
  notes?: string,
): Promise<WorkflowResult> {
  return request<WorkflowResult>(`/workflow/${type}/${id}/request-changes`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
}

export function workflowApprove(type: ObjectType, id: string): Promise<WorkflowResult> {
  return request<WorkflowResult>(`/workflow/${type}/${id}/approve`, { method: 'POST' });
}

export function workflowPublish(type: ObjectType, id: string): Promise<WorkflowResult> {
  return request<WorkflowResult>(`/workflow/${type}/${id}/publish`, { method: 'POST' });
}

export function workflowSchedule(
  type: ObjectType,
  id: string,
  scheduledAt: string,
): Promise<WorkflowResult> {
  return request<WorkflowResult>(`/workflow/${type}/${id}/schedule`, {
    method: 'POST',
    body: JSON.stringify({ scheduled_at: scheduledAt }),
  });
}

export function workflowUnpublish(
  type: ObjectType,
  id: string,
  mode: 'retract' | 'revert_to_draft' | 'suppress' = 'revert_to_draft',
): Promise<WorkflowResult> {
  return request<WorkflowResult>(`/workflow/${type}/${id}/unpublish`, {
    method: 'POST',
    body: JSON.stringify({ mode }),
  });
}

// ── Navigation Manager ────────────────────────────────────────────────────

export interface NavEntry {
  id:                   string;
  label:                string;
  destination_type:     'internal_page' | 'external_url';
  destination_value:    string;
  position:             number;
  is_badge_highlighted: boolean;
  badge_text:           string | null;
  navigation_column_id: string;
}

export interface NavColumn {
  id:                   string;
  column_id:            string;
  label:                string;
  position:             number;
  navigation_group_id:  string;
  entries:              NavEntry[];
}

export interface NavGroup {
  id:        string;
  group_id:  string;
  label:     string;
  type:      'mega_menu' | 'dropdown' | 'direct_link';
  position:  number;
  is_active: boolean;
  columns:   NavColumn[];
}

export function fetchNavGroups(): Promise<{ groups: NavGroup[] }> {
  return request<{ groups: NavGroup[] }>('/navigation/groups');
}

export function createNavGroup(payload: {
  label: string; group_id: string; type: 'mega_menu' | 'dropdown' | 'direct_link'; position: number; is_active: boolean;
}): Promise<{ id: string }> {
  return request<{ id: string }>('/navigation/groups', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateNavGroup(id: string, payload: Partial<{
  label: string; type: 'mega_menu' | 'dropdown' | 'direct_link'; position: number; is_active: boolean;
}>): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/navigation/groups/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteNavGroup(id: string): Promise<void> {
  return request<void>(`/navigation/groups/${id}`, { method: 'DELETE' });
}

export function createNavColumn(payload: {
  navigation_group_id: string; label: string; position: number;
}): Promise<{ id: string }> {
  return request<{ id: string }>('/navigation/columns', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateNavColumn(id: string, payload: Partial<{
  label: string; position: number;
}>): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/navigation/columns/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteNavColumn(id: string): Promise<void> {
  return request<void>(`/navigation/columns/${id}`, { method: 'DELETE' });
}

export function createNavEntry(payload: {
  navigation_column_id: string; label: string; destination_type: string;
  destination_value: string; position: number; is_badge_highlighted: boolean; badge_text: string | null;
}): Promise<{ id: string }> {
  return request<{ id: string }>('/navigation/entries', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateNavEntry(id: string, payload: Partial<{
  label: string; destination_type: string; destination_value: string;
  position: number; is_badge_highlighted: boolean; badge_text: string | null;
}>): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/navigation/entries/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteNavEntry(id: string): Promise<void> {
  return request<void>(`/navigation/entries/${id}`, { method: 'DELETE' });
}

// ── Audit trail ───────────────────────────────────────────────────────────

export function fetchTransitions(
  type: ObjectType,
  id: string,
): Promise<StatusTransition[]> {
  return request<StatusTransition[]>(`/transitions/${type}/${id}`);
}
