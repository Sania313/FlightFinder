import { useCallback, useRef, useState } from 'react';
import { Flight, SearchError, SearchParams } from '../models/flight';
import { getDemoFlights } from '../data/demoFlights';
import { fetchFlights } from '../services/serpApi';

export function useFlightSearch() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SearchError | null>(null);
  const [usedDemo, setUsedDemo] = useState(false);
  const [lastParams, setLastParams] = useState<SearchParams | null>(null);
  const loadingRef = useRef(false);

  const search = useCallback(async (params: SearchParams, demoMode: boolean) => {
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);
    setLastParams(params);

    try {
      if (demoMode) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setFlights(getDemoFlights());
        setUsedDemo(true);
        return;
      }

      const results = await fetchFlights(params);
      setFlights(results);
      setUsedDemo(false);
    } catch (err) {
      const searchError =
        err && typeof err === 'object' && 'kind' in err && 'message' in err
          ? (err as SearchError)
          : {
              kind: 'unknown' as const,
              message: 'Something went wrong. Please try again or use Demo Mode.',
            };
      setError(searchError);
      setFlights([]);
      setUsedDemo(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    flights,
    loading,
    error,
    usedDemo,
    lastParams,
    search,
    clearError,
  };
}
