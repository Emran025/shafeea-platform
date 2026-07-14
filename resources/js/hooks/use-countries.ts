import { useState, useEffect } from 'react';
import axios from 'axios';
import { Country } from '@/types';

// Module-level singleton: one in-flight request shared across all hook instances.
// Prevents duplicate GET /countries requests when multiple components mount
// simultaneously (e.g. CountrySelect + PhoneInput on the same page).
let countriesCache: Country[] | null = null;
let pendingPromise: Promise<Country[]> | null = null;

function fetchCountries(): Promise<Country[]> {
    if (countriesCache !== null) return Promise.resolve(countriesCache);
    if (pendingPromise !== null) return pendingPromise;

    pendingPromise = axios
        .get<Country[]>('/countries')
        .then((response) => {
            countriesCache = response.data;
            pendingPromise = null;
            return countriesCache;
        })
        .catch((error) => {
            pendingPromise = null; // allow retry on next mount
            return Promise.reject(error);
        });

    return pendingPromise;
}

export function useCountries() {
    const [countries, setCountries] = useState<Country[]>(countriesCache ?? []);
    const [loading, setLoading] = useState(countriesCache === null);

    useEffect(() => {
        if (countriesCache !== null) return; // already populated — skip fetch

        fetchCountries()
            .then((data) => {
                setCountries(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching countries:', error);
                setLoading(false);
            });
    }, []);

    return { countries, loading };
}
