import { Flight, FlightSegment } from '../models/flight';

interface SerpAirport {
  name?: string;
  id?: string;
  time?: string;
}

interface SerpFlightLeg {
  departure_airport?: SerpAirport;
  arrival_airport?: SerpAirport;
  duration?: number;
  airplane?: string;
  airline?: string;
  airline_logo?: string;
  flight_number?: string;
}

interface SerpFlightOption {
  flights?: SerpFlightLeg[];
  layovers?: unknown[];
  total_duration?: number;
  price?: number;
  airline_logo?: string;
}

interface SerpFlightsResponse {
  best_flights?: SerpFlightOption[];
  other_flights?: SerpFlightOption[];
  error?: string;
}

function buildId(option: SerpFlightOption, index: number): string {
  const first = option.flights?.[0];
  const last = option.flights?.[option.flights.length - 1];
  const parts = [
    first?.airline ?? 'unknown',
    first?.flight_number ?? String(index),
    first?.departure_airport?.id ?? '',
    last?.arrival_airport?.id ?? '',
    first?.departure_airport?.time ?? '',
    String(option.price ?? 'na'),
  ];
  return parts.join('|');
}

function mapSegment(leg: SerpFlightLeg): FlightSegment {
  return {
    airline: leg.airline ?? 'Unknown airline',
    flightNumber: leg.flight_number,
    aircraft: leg.airplane,
    origin: leg.departure_airport?.id ?? '???',
    originName: leg.departure_airport?.name,
    destination: leg.arrival_airport?.id ?? '???',
    destinationName: leg.arrival_airport?.name,
    departureTime: leg.departure_airport?.time ?? '',
    arrivalTime: leg.arrival_airport?.time ?? '',
    duration: leg.duration ?? 0,
  };
}

function mapOption(option: SerpFlightOption, index: number): Flight | null {
  const legs = option.flights ?? [];
  if (legs.length === 0) {
    return null;
  }

  const first = legs[0];
  const last = legs[legs.length - 1];
  const segments = legs.map(mapSegment);
  const stops = Math.max(legs.length - 1, option.layovers?.length ?? 0);

  return {
    id: buildId(option, index),
    airline: first.airline ?? 'Unknown airline',
    airlineLogo: option.airline_logo ?? first.airline_logo,
    origin: first.departure_airport?.id ?? '???',
    destination: last.arrival_airport?.id ?? '???',
    departureTime: first.departure_airport?.time ?? '',
    arrivalTime: last.arrival_airport?.time ?? '',
    duration: option.total_duration ?? segments.reduce((sum, s) => sum + s.duration, 0),
    stops,
    price: typeof option.price === 'number' ? option.price : undefined,
    aircraft: first.airplane,
    segments,
    isDemo: false,
  };
}

/** Convert a SerpAPI Google Flights JSON payload into app Flight models. */
export function mapSerpFlightsResponse(data: unknown): Flight[] {
  if (!data || typeof data !== 'object') {
    return [];
  }

  const response = data as SerpFlightsResponse;
  const combined = [...(response.best_flights ?? []), ...(response.other_flights ?? [])];

  const flights: Flight[] = [];
  const seen = new Set<string>();

  combined.forEach((option, index) => {
    const flight = mapOption(option, index);
    if (!flight || seen.has(flight.id)) {
      return;
    }
    seen.add(flight.id);
    flights.push(flight);
  });

  return flights;
}

export function getSerpErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  const error = (data as SerpFlightsResponse).error;
  return typeof error === 'string' && error.length > 0 ? error : null;
}
