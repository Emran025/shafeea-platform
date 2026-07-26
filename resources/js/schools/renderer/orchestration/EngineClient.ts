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
 * Derives the active locale from the URL pathname prefix.
 * `/ar/...` → 'ar', everything else → 'en'.
 * This ensures the composition locale matches the page being visited,
 * not the user's browser/OS language preference.
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

    const res = await fetch(`/api/content/${normalised}`, {
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
