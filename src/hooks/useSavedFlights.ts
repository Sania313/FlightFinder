import { useCallback, useEffect, useState } from 'react';
import { Flight } from '../models/flight';
import {
  loadSavedFlights,
  removeSavedFlight,
  saveFlight,
} from '../storage/savedFlights';

export function useSavedFlights() {
  const [saved, setSaved] = useState<Flight[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const items = await loadSavedFlights();
    setSaved(items);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (flight: Flight) => {
    const next = await saveFlight(flight);
    setSaved(next);
    return next;
  }, []);

  const remove = useCallback(async (flightId: string) => {
    const next = await removeSavedFlight(flightId);
    setSaved(next);
    return next;
  }, []);

  const isSaved = useCallback(
    (flightId: string) => saved.some((item) => item.id === flightId),
    [saved],
  );

  return { saved, ready, refresh, add, remove, isSaved };
}
