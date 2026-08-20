/**
 * useScrolled
 * Returns true when the page has been scrolled past the given threshold.
 * Extracted from NavigationBar to make it a reusable, testable hook.
 */
import { useState, useEffect } from 'react';

export function useScrolled(threshold = 20): boolean {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > threshold);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    return scrolled;
}
