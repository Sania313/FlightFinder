import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flight } from '../models/flight';

const STORAGE_KEY = '@flightfinder/saved_flights';

export async function loadSavedFlights(): Promise<Flight[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Flight[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveFlight(flight: Flight): Promise<Flight[]> {
  const existing = await loadSavedFlights();
  if (existing.some((item) => item.id === flight.id)) {
    return existing;
  }
  const next = [flight, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function removeSavedFlight(flightId: string): Promise<Flight[]> {
  const existing = await loadSavedFlights();
  const next = existing.filter((item) => item.id !== flightId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function isFlightSaved(flightId: string): Promise<boolean> {
  const existing = await loadSavedFlights();
  return existing.some((item) => item.id === flightId);
}
