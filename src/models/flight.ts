export interface FlightSegment {
  airline: string;
  flightNumber?: string;
  aircraft?: string;
  origin: string;
  originName?: string;
  destination: string;
  destinationName?: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
}

export interface Flight {
  id: string;
  airline: string;
  airlineLogo?: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: number;
  price?: number;
  aircraft?: string;
  segments: FlightSegment[];
  isDemo?: boolean;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  tripType: 'round-trip' | 'one-way';
}

export type SearchErrorKind = 'network' | 'rate_limit' | 'api' | 'unknown';

export interface SearchError {
  kind: SearchErrorKind;
  message: string;
}
