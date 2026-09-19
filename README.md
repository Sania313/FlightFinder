# FlightFinder

Cross-platform flight search app built with **React Native**, **TypeScript**, and **Expo (SDK 57)**.  
Runs on **mobile** (Expo Go) and in a **web browser**.

Live results use the SerpAPI Google Flights API through a small local proxy.  
Reviewers can complete the full flow with **sample data** (no API key required).

> **Deployment is optional.** Clear local run instructions below are enough for review.

---

## Prerequisites

- Node.js 20+ (Node 22 works)
- npm
- For phone testing: [Expo Go](https://expo.dev/go) on iOS or Android
- An Expo account (needed to open projects in newer Expo Go — run `npx expo login`)

---

## Local run (step by step)

### 1. Install dependencies

```bash
cd FlightFinder
npm install
```

### 2. Environment file

```bash
cp .env.example .env
```

On Windows PowerShell (if `cp` is unavailable):

```powershell
Copy-Item .env.example .env
```

Edit `.env`:

```env
# Required for LIVE search only (used by the local proxy — not committed)
SERPAPI_KEY=your_serpapi_key_here

# Leave empty so the key is not bundled into the client
EXPO_PUBLIC_SERPAPI_KEY=

# Optional; defaults to http://localhost:8787/api
EXPO_PUBLIC_API_PROXY_URL=http://localhost:8787/api
```

- Never commit a real API key (`.env` is gitignored).
- If you only use **sample data**, you can leave `SERPAPI_KEY` empty.

### 3. Start the local API proxy (Terminal 1) — needed for live search

```bash
npm run proxy
```

You should see:

```text
FlightFinder proxy listening on http://localhost:8787
```

Leave this terminal open.

**If you see `EADDRINUSE ... 8787`:** an old proxy is already running. Either use that one, or stop it and start again:

```powershell
netstat -ano | findstr :8787
taskkill /PID <pid> /F
npm run proxy
```

After changing `.env`, always restart the proxy so it reloads the key.

### 4. Start the app (Terminal 2)

```bash
npm start
```

Then choose a target:

| Key | Target |
|-----|--------|
| `w` | Web browser |
| Scan QR | Phone with Expo Go (same Wi‑Fi) |
| `a` / `i` | Android / iOS simulator (if installed) |

#### Phone (Expo Go)

1. Sign in to Expo Go with the **same** account as your computer.
2. On the computer, ensure you are logged in:

```bash
npx expo login
npx expo whoami
```

3. Phone and computer on the **same Wi‑Fi**.
4. Scan the QR code from `npm start`.
5. Keep `npm run proxy` running for **live** search on the phone (the app talks to your computer’s proxy on the LAN).

#### Web

Press `w` after `npm start`, or run:

```bash
npm run web
```

---

## Two ways to use the app

### A) Sample data (no key, no proxy)

Best for reviewers without SerpAPI access:

1. Open the app (web or phone).
2. On Search, tap **No API? Try sample data**,  
   **or** if live search fails, tap **Try sample data**.
3. Results show a bar: **Sample data · not live prices**.
4. You can sort, filter, open details, and save flights.

Suggested search values (also pre-filled): **YYZ → LHR**, future dates, 1 passenger, round trip.

### B) Live SerpAPI search

1. Set `SERPAPI_KEY` in `.env`.
2. Run **proxy** (Terminal 1) + **app** (Terminal 2).
3. Tap **Search flights** (leave sample link unused).
4. You should see real airline results.

---

## Useful scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run proxy` | Local SerpAPI proxy (`localhost:8787`) |
| `npm start` | Expo dev server |
| `npm run web` | Open web |
| `npm run android` | Open Android |
| `npm run ios` | Open iOS |
| `npm test` | Run automated tests |

---

## Why a local proxy?

SerpAPI does not send browser CORS headers, so a web app cannot call it directly.  
`server/proxy.mjs` calls SerpAPI on the server side and keeps `SERPAPI_KEY` out of the client bundle.

- Web → `http://localhost:8787/api/...`
- Phone (Expo Go) → `http://<your-computer-lan-ip>:8787/api/...` (resolved automatically)

---

## Tests

```bash
npm test
```

## Manual test checklist

- [ ] Validation: empty origin/destination, same airports, missing departure, return before departure, passengers &lt; 1
- [ ] Sample data: multiple results, sort (lowest price), filter (non-stop only)
- [ ] Details show itinerary segments for the selected flight
- [ ] Save / remove flight; saved list persists after restart
- [ ] Saving the same flight twice does not create duplicates
- [ ] Live search (proxy + key): loading state; Search disabled while loading
- [ ] Error path: stop proxy or remove key → clear error + **Try sample data**
- [ ] Usable at phone width and in a desktop browser

---

## Project structure (important files)

| Path | Role |
|------|------|
| `src/services/serpApi.ts` | Flight search request (via proxy on web) |
| `server/proxy.mjs` | Local proxy; holds API key |
| `src/services/flightMapper.ts` | SerpAPI JSON → app `Flight` model |
| `src/data/demoFlights.ts` | Sample / Demo Mode dataset |
| `src/storage/savedFlights.ts` | AsyncStorage save / remove / load |
| `src/screens/*` | Search, Results, Details, Saved |
| `src/utils/validation.ts` | Search form validation |
| `DEVELOPMENT-NOTES.md` | Approach, AI use, problems, limitations |

---

## Optional: web export (not required for review)

```bash
npx expo export --platform web
```

Output is written for static hosting. A public deploy is **not required**; local run is sufficient per the assignment.

---

## Limitations

See `DEVELOPMENT-NOTES.md` (round-trip outbound focus, text date inputs, local proxy required for live web search, etc.).
