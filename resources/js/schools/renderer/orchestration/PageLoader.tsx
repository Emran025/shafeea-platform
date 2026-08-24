import { useLocation } from 'react-router-dom';
import { fetchPage } from './EngineClient';
import PageRenderer from '../PageRenderer';
import ErrorPage from '../state/ErrorPage';
import LoadingPage from '../state/LoadingPage';
import type { ContractEnvelope } from '../../types/engine';
import { isErrorContract } from '../../types/engine';
import { useState, useCallback, useEffect } from 'react';

/**
 * PageLoader — orchestration/PageLoader
 * Manages the data-fetching lifecycle for a single page contract.
 * Extracted from App.tsx to keep the root app free of data-fetching logic.
 */

export default function PageLoader() {
    const location                              = useLocation();
    const [contract,   setContract]             = useState<ContractEnvelope | null>(null);
    const [loading,    setLoading]              = useState(true);
    const [fetchError, setFetchError]           = useState<string | null>(null);

    const slug = location.pathname.replace(/^\/+/, '') || 'home';

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

    if (loading)    return <LoadingPage />;
    if (fetchError) return <ErrorPage type="NETWORK_ERROR" message={fetchError} />;
    if (!contract)  return <ErrorPage type="PAGE_NOT_FOUND" />;

    if (isErrorContract(contract)) {
        return (
            <ErrorPage
                type={contract.payload.error_type}
                message={contract.payload.message}
                navigation={contract.payload.navigation}
            />
        );
    }

    return <PageRenderer contract={contract} />;
}
