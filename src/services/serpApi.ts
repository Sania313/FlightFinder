import { Platform } from 'react-native';
import { Flight, SearchError, SearchParams } from '../models/flight';
import { getSerpErrorMessage, mapSerpFlightsResponse } from './flightMapper';
import { resolveProxyBaseUrl } from './proxyUrl';

const SERPAPI_URL = 'https://serpapi.com/search.json';

const DIRECT_KEY = process.env.EXPO_PUBLIC_SERPAPI_KEY;

/**
 * Browsers refuse direct SerpAPI calls (no CORS headers), so web always goes
 * through the local proxy. Native can call SerpAPI directly when a public key
 * is present, otherwise it uses the proxy too.
 */
function useProxy(): boolean {
  return Platform.OS === 'web' || !DIRECT_KEY;
}

function classifyError(status: number, message: string): SearchError {
  if (status === 429 || /rate|limit|quota|run out of searches/i.test(message)) {
    return {
      kind: 'rate_limit',
      message:
        'Live search is temporarily unavailable because the API usage limit was reached. Try Demo Mode or retry later.',
    };
  }

  if (status === 0 || /network|fetch|internet|failed to fetch/i.test(message)) {
    if (useProxy()) {
      return {
        kind: 'network',
        message:
          'Could not reach the local API proxy. Start it with "npm run proxy" in a second terminal, or use Demo Mode.',
      };
    }
    return {
      kind: 'network',
      message: 'Unable to reach the flight service. Check your connection or use Demo Mode.',
    };
  }

  return {
    kind: 'api',
    message:
      message || 'Something went wrong while searching for flights. Please try again or use Demo Mode.',
  };
}

function buildQuery(params: SearchParams, includeKey: boolean): URLSearchParams {
  const query = new URLSearchParams({
    engine: 'google_flights',
    departure_id: params.origin.toUpperCase(),
    arrival_id: params.destination.toUpperCase(),
    outbound_date: params.departureDate,
    adults: String(params.passengers),
    type: params.tripType === 'round-trip' ? '1' : '2',
    currency: 'USD',
    hl: 'en',
  });

  if (params.tripType === 'round-trip' && params.returnDate) {
    query.set('return_date', params.returnDate);
  }

  if (includeKey && DIRECT_KEY) {
    query.set('api_key', DIRECT_KEY);
  }

  return query;
}

const REQUEST_TIMEOUT_MS = 20000;

/** Searches are idempotent GETs, so one retry covers a dropped connection. */
async function fetchWithRetry(url: string, attempt = 0): Promise<Response> {
  try {
    return await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (err) {
    if (attempt === 0) {
      return fetchWithRetry(url, attempt + 1);
    }
    const message = err instanceof Error ? err.message : 'Network request failed';
    throw classifyError(0, message);
  }
}

export async function fetchFlights(params: SearchParams): Promise<Flight[]> {
  const viaProxy = useProxy();
  const query = buildQuery(params, !viaProxy);
  const url = viaProxy
    ? `${resolveProxyBaseUrl()}/flights?${query.toString()}`
    : `${SERPAPI_URL}?${query.toString()}`;

  const response = await fetchWithRetry(url);

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw classifyError(response.status, `Flight search failed with status ${response.status}`);
  }

  const apiMessage = getSerpErrorMessage(data);

  if (!response.ok) {
    throw classifyError(
      response.status,
      apiMessage ?? `Flight search failed with status ${response.status}`,
    );
  }

  if (apiMessage) {
    throw classifyError(response.status, apiMessage);
  }

  return mapSerpFlightsResponse(data);
}
