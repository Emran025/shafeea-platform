import React, { useState, useEffect, useRef } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/layout/scroll-to-top';

interface SiteLayoutProps {
    children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [bePartOfUsDropdownOpen, setBePartOfUsDropdownOpen] = useState(false);
    const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentPath, setCurrentPath] = useState('');

    const bePartOfUsDropdownRef = useRef<HTMLDivElement | null>(null);
    const helpDropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
            setIsDarkMode(document.documentElement.classList.contains('dark'));
            
            const handleScroll = () => setShowScrollTop(window.scrollY > 400);
            window.addEventListener('scroll', handleScroll);

            const handleClickOutside = (event: MouseEvent) => {
                const target = event.target as Node;
                if (bePartOfUsDropdownOpen && bePartOfUsDropdownRef.current && !bePartOfUsDropdownRef.current.contains(target)) setBePartOfUsDropdownOpen(false);
                if (helpDropdownOpen && helpDropdownRef.current && !helpDropdownRef.current.contains(target)) setHelpDropdownOpen(false);
            };
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                window.removeEventListener('scroll', handleScroll);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [bePartOfUsDropdownOpen, helpDropdownOpen]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="h-screen min-h-screen bg-background text-foreground overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <TopBar />
            
            <Header 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                currentPath={currentPath}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                bePartOfUsDropdownOpen={bePartOfUsDropdownOpen}
                setBePartOfUsDropdownOpen={setBePartOfUsDropdownOpen}
                helpDropdownOpen={helpDropdownOpen}
                setHelpDropdownOpen={setHelpDropdownOpen}
                bePartOfUsRef={bePartOfUsDropdownRef}
                helpRef={helpDropdownRef}
            />

            <main className="flex-1">
                {children}
            </main>

            <Footer />

            <ScrollToTop visible={showScrollTop} />
        </div>
    );
}