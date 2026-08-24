import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingPage from '../state/LoadingPage';
import NavigationBar from '../chrome/NavigationBar';
import NewsroomBar from '../chrome/NewsroomBar';
import PageFooter from '../chrome/PageFooter';
import NewsArticleDetailSection from '../sections/NewsArticleDetailSection';
import { fetchPage } from '../orchestration/EngineClient';
import type { ContractEnvelope } from '../../types/engine';
import { isErrorContract } from '../../types/engine';
import type { Navigation as EngineNavigation } from '../../types/engine';

/**
 * NewsDetailPage — full article detail page.
 * Loads the /news page contract to get navigation chrome, then renders the
 * article detail body. Falls back to a standalone layout if the API fails.
 */
export default function NewsDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [contract, setContract] = useState<ContractEnvelope | null>(null);
    const [loading, setLoading]   = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchPage('newsroom/news');
            setContract(data);
        } catch {
            setContract(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        document.title = `News Article · ACCSYSTEM Newsroom`;
    }, [slug]);

    if (loading) return <LoadingPage />;

    // Extract navigation from the contract for chrome
    let navigation: EngineNavigation | null = null;
    if (contract && !isErrorContract(contract)) {
        navigation = (contract.payload as any).navigation as EngineNavigation;
    }

    return (
        <div className="page-wrapper">
            {navigation && <NavigationBar navigation={navigation} />}
            <NewsroomBar />
            <main className="page-main">
                <NewsArticleDetailSection />
            </main>
            {navigation && <PageFooter navigation={navigation} />}
        </div>
    );
}
