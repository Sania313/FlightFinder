import { createServer } from 'node:http';

// Local proxy so the web build never calls SerpAPI directly.
// Browsers block direct calls (SerpAPI sends no CORS headers) and a browser
// request would also expose the API key, so the key stays on this server.

const PORT = Number(process.env.PROXY_PORT ?? 8787);
const API_KEY = process.env.SERPAPI_KEY ?? process.env.EXPO_PUBLIC_SERPAPI_KEY;
const SERPAPI_URL = 'https://serpapi.com/search.json';

const ALLOWED_PARAMS = new Set([
  'engine',
  'departure_id',
  'arrival_id',
  'outbound_date',
  'return_date',
  'adults',
  'type',
  'currency',
  'hl',
]);

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
  });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true, hasKey: Boolean(API_KEY) });
    return;
  }

  if (url.pathname !== '/api/flights') {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  if (!API_KEY) {
    sendJson(res, 500, {
      error: 'No SerpAPI key configured on the proxy. Set SERPAPI_KEY in .env.',
    });
    return;
  }

  const query = new URLSearchParams();
  for (const [key, value] of url.searchParams.entries()) {
    if (ALLOWED_PARAMS.has(key) && value) {
      query.set(key, value);
    }
  }
  query.set('engine', 'google_flights');
  query.set('api_key', API_KEY);

  try {
    const upstream = await fetch(`${SERPAPI_URL}?${query.toString()}`);
    const data = await upstream.json();
    sendJson(res, upstream.status, data);
  } catch (err) {
    sendJson(res, 502, {
      error: err instanceof Error ? err.message : 'Upstream request failed',
    });
  }
});

// Outlive the browser's idle socket reuse window so reused connections don't drop.
server.keepAliveTimeout = 65000;
server.headersTimeout = 70000;

server.listen(PORT, () => {
  console.log(`FlightFinder proxy listening on http://localhost:${PORT}`);
  if (!API_KEY) {
    console.warn('Warning: no SERPAPI_KEY found. Live search will fail; Demo Mode still works.');
  }
});
