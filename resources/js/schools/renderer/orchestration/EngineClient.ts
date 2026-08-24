import type { ContractEnvelope } from '../../types/engine';

/**
 * EngineClient — orchestration/EngineClient
 * HTTP client for the ACCSYSTEM content engine API.
 * Canonical location is orchestration/.
 */

const CONTRACT_VERSION = 'rendering_contract@2.0';

export interface FetchPageOptions {
    locale?:   'en' | 'ar';
    audience?: 'public' | 'authenticated' | 'admin_preview';
    preview?:  boolean;
}

/**
 * Derives the school-scoped API base URL from the school code injected by
 * the Blade shell. Returns `/school/{code}/api` when a school code is present,
 * and falls back to `/api` for global / dev contexts.
 */
export function getApiBase(): string {
    const schoolCode =
        (window as any).__SCHOOL_DATA__?.code ||
        document.getElementById('app')?.dataset.schoolCode ||
        '';
    return schoolCode ? `/school/${schoolCode}/api` : '/api';
}

/**
 * Derives the active locale from the URL pathname prefix.
 * `/ar/...` → 'ar', everything else → 'en'.
 * This ensures the composition locale matches the page being visited,
 * not the user's browser/OS language preference.
 * Note: with a BrowserRouter basename the pathname is already stripped of
 * the /school/{code} prefix, so we just check for a leading /ar segment.
 */
export function getLocaleFromPath(pathname?: string): 'en' | 'ar' {
    const path = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    return path.startsWith('/ar') ? 'ar' : 'en';
}

/** @deprecated Use getLocaleFromPath instead */
export function getBrowserLocale(): 'en' | 'ar' {
    return getLocaleFromPath();
}

export async function fetchPage(
    slug: string,
    { locale = getLocaleFromPath(), audience = 'public', preview = false }: FetchPageOptions = {},
): Promise<ContractEnvelope> {
    const normalised = slug.replace(/^\/+|\/+$/g, '').toLowerCase() || 'home';
    const apiBase    = getApiBase();

    const res = await fetch(`${apiBase}/content/${normalised}`, {
        headers: {
            'X-Contract-Version': CONTRACT_VERSION,
            'X-Locale':           locale,
            'X-Audience':         audience,
            'X-Preview':          String(preview),
            'X-Request-ID':       crypto.randomUUID(),
            'Accept':             'application/json',
        },
    });

    const data = await res.json() as ContractEnvelope;
    return data;
}
