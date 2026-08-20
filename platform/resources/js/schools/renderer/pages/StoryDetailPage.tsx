import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import LoadingPage from '../state/LoadingPage';
import NavigationBar from '../chrome/NavigationBar';
import NewsroomBar from '../chrome/NewsroomBar';
import PageFooter from '../chrome/PageFooter';
import StoryDetailSection from '../sections/StoryDetailSection';
import { fetchPage } from '../orchestration/EngineClient';
import type { ContractEnvelope } from '../../types/engine';
import { isErrorContract } from '../../types/engine';
import type { Navigation as EngineNavigation } from '../../types/engine';

/**
 * StoryDetailPage — full story detail page.
 * Loads the /stories page contract to get navigation chrome, then renders the
 * story detail body. Falls back to a standalone layout if the API fails.
 */
export default function StoryDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [contract, setContract] = useState<ContractEnvelope | null>(null);
    const [loading, setLoading]   = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            // Try the stories page first for accurate nav; fall back to home contract.
            const data = await fetchPage('stories').catch(() => fetchPage('home'));
            setContract(data);
        } catch {
            setContract(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        document.title = `Story · ACCSYSTEM Stories`;
    }, [slug]);

    if (loading) return <LoadingPage />;

    let navigation: EngineNavigation | null = null;
    if (contract && !isErrorContract(contract)) {
        navigation = (contract.payload as any).navigation as EngineNavigation;
    }

    return (
        <div className="page-wrapper">
            {navigation && <NavigationBar navigation={navigation} />}
            <NewsroomBar />
            <main className="page-main">
                <StoryDetailSection />
            </main>
            {navigation && <PageFooter navigation={navigation} />}
        </div>
    );
}
