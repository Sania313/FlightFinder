import { Flight } from '../models/flight';

export type SortOption = 'price_asc' | 'duration_asc';

export function sortFlights(flights: Flight[], sortBy: SortOption): Flight[] {
  const sorted = [...flights];
  if (sortBy === 'price_asc') {
    sorted.sort((a, b) => {
      const priceA = a.price ?? Number.POSITIVE_INFINITY;
      const priceB = b.price ?? Number.POSITIVE_INFINITY;
      return priceA - priceB;
    });
  } else {
    sorted.sort((a, b) => a.duration - b.duration);
  }
  return sorted;
}

export function filterFlights(flights: Flight[], nonStopOnly: boolean): Flight[] {
  if (!nonStopOnly) {
    return flights;
  }
  return flights.filter((flight) => flight.stops === 0);
}

export function applySortAndFilter(
  flights: Flight[],
  sortBy: SortOption,
  nonStopOnly: boolean,
): Flight[] {
  return sortFlights(filterFlights(flights, nonStopOnly), sortBy);
}
