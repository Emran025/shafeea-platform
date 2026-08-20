import { useEffect, useRef, useState } from 'react';

/**
 * Fetches a username suggestion from the server whenever `name` changes.
 *
 * Behaviour:
 *  - Debounces calls by `delay` ms (default 400) so we don't hammer the server
 *    on every keystroke.
 *  - Returns `suggestion = null` while loading or when `name` is empty.
 *  - Automatically cancels in-flight requests when the component unmounts or
 *    when `name` changes before the response arrives (via AbortController).
 *
 * Usage:
 *   const { suggestion, loading } = useUsernameSuggestion(data.user_name);
 */
export function useUsernameSuggestion(
    name: string,
    delay = 400,
): { suggestion: string | null; loading: boolean } {
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        // Nothing to suggest for an empty/whitespace-only name.
        const trimmed = name.trim();
        if (!trimmed) {
            setSuggestion(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        const timer = setTimeout(async () => {
            // Cancel any previous in-flight request.
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const url = `/username/suggest?name=${encodeURIComponent(trimmed)}`;
                const res = await fetch(url, { signal: controller.signal });

                if (!res.ok) {
                    setSuggestion(null);
                    return;
                }

                const json = (await res.json()) as { username: string };
                // Return empty string as null so callers can treat falsy uniformly.
                setSuggestion(json.username || null);
            } catch (err: unknown) {
                // Ignore AbortError — it just means a newer request superseded this one.
                if (err instanceof Error && err.name !== 'AbortError') {
                    setSuggestion(null);
                }
            } finally {
                setLoading(false);
            }
        }, delay);

        return () => {
            clearTimeout(timer);
            abortRef.current?.abort();
        };
    }, [name, delay]);

    return { suggestion, loading };
}
