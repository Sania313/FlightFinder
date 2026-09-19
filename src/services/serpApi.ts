import { SearchParams, SearchError } from '../models/flight';
import { getSerpErrorMessage, mapSerpFlightsResponse } from './flightMapper';
import { Flight } from '../models/flight';

const BASE_URL = 'https://serpapi.com/search.json';

function classifyError(status: number, message: string): SearchError {
  if (status === 429 || /rate|limit|quota/i.test(message)) {
    return {
      kind: 'rate_limit',
      message:
        'Live search is temporarily unavailable because the API usage limit was reached. Try Demo Mode or retry later.',
    };
  }
  if (status === 0 || /network|fetch|internet|failed to fetch/i.test(message)) {
    return {
      kind: 'network',
      message: 'Unable to reach the flight service. Check your connection or use Demo Mode.',
    };
  }
  return {
    kind: 'api',
    message: message || 'Something went wrong while searching for flights. Please try again or use Demo Mode.',
  };
}

export async function fetchFlights(params: SearchParams): Promise<Flight[]> {
  const apiKey = process.env.EXPO_PUBLIC_SERPAPI_KEY;

  if (!apiKey) {
    const error: SearchError = {
      kind: 'api',
      message:
        'No API key configured. Add EXPO_PUBLIC_SERPAPI_KEY to your .env file, or use Demo Mode.',
    };
    throw error;
  }

  const query = new URLSearchParams({
    engine: 'google_flights',
    departure_id: params.origin.toUpperCase(),
    arrival_id: params.destination.toUpperCase(),
    outbound_date: params.departureDate,
    adults: String(params.passengers),
    type: params.tripType === 'round-trip' ? '1' : '2',
    currency: 'USD',
    hl: 'en',
    api_key: apiKey,
  });

  if (params.tripType === 'round-trip' && params.returnDate) {
    query.set('return_date', params.returnDate);
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}?${query.toString()}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network request failed';
    throw classifyError(0, message);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw classifyError(response.status, `SerpAPI request failed with status ${response.status}`);
  }

  if (!response.ok) {
    const apiMessage = getSerpErrorMessage(data) ?? `SerpAPI request failed with status ${response.status}`;
    throw classifyError(response.status, apiMessage);
  }

  const apiMessage = getSerpErrorMessage(data);
  if (apiMessage) {
    throw classifyError(response.status, apiMessage);
  }

  return mapSerpFlightsResponse(data);
}
