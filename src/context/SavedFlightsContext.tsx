import React, { createContext, useContext, useMemo } from 'react';
import { Flight } from '../models/flight';
import { useSavedFlights } from '../hooks/useSavedFlights';

interface SavedFlightsContextValue {
  saved: Flight[];
  ready: boolean;
  refresh: () => Promise<void>;
  add: (flight: Flight) => Promise<Flight[]>;
  remove: (flightId: string) => Promise<Flight[]>;
  isSaved: (flightId: string) => boolean;
}

const SavedFlightsContext = createContext<SavedFlightsContextValue | null>(null);

export function SavedFlightsProvider({ children }: { children: React.ReactNode }) {
  const value = useSavedFlights();
  const memo = useMemo(() => value, [value]);
  return (
    <SavedFlightsContext.Provider value={memo}>{children}</SavedFlightsContext.Provider>
  );
}

export function useSavedFlightsContext(): SavedFlightsContextValue {
  const ctx = useContext(SavedFlightsContext);
  if (!ctx) {
    throw new Error('useSavedFlightsContext must be used within SavedFlightsProvider');
  }
  return ctx;
}
