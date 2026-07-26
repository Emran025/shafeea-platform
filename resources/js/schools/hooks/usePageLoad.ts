/**
 * usePageLoad
 * Manages the full lifecycle of loading a page contract by slug.
 * Extracted from App.tsx > PageLoader to be a reusable, testable hook.
 */
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchPage } from '../renderer/orchestration/EngineClient';
import type { ContractEnvelope } from '../types/engine';

export interface PageLoadState {
    contract:   ContractEnvelope | null;
    loading:    boolean;
    fetchError: string | null;
    reload:     () => void;
}

export function usePageLoad(): PageLoadState {
    const location = useLocation();
    const slug = location.pathname.replace(/^\/+/, '') || 'home';

    const [contract,   setContract]   = useState<ContractEnvelope | null>(null);
    const [loading,    setLoading]    = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const data = await fetchPage(slug);
            setContract(data);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown network error';
            setFetchError('Network error: ' + msg);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => { load(); }, [load]);

    return { contract, loading, fetchError, reload: load };
}
