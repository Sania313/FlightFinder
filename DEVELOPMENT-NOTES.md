# DEVELOPMENT-NOTES

## Approach

The app is a small Expo (SDK 57) TypeScript project with tab navigation (Search / Saved) and a stack for Results → Details.

- **Data flow:** Search form validates input → Results screen calls either Demo Mode sample data or `fetchFlights` in `src/services/serpApi.ts` → `mapSerpFlightsResponse` in `src/services/flightMapper.ts` converts SerpAPI JSON into a simple `Flight` model → Results apply in-memory sort (lowest price / shortest) and filter (non-stop) → Details shows segments → Save uses AsyncStorage via `src/storage/savedFlights.ts` (deduped by `id`).
- **Storage:** `@react-native-async-storage/async-storage` so saved flights persist on device and in the browser.
- **Libraries:** React Navigation (native stack + bottom tabs), Expo Status Bar, AsyncStorage. No custom backend.

## AI assistance

Used Cursor AI for planning the folder structure from the assignment brief, scaffolding screens/components, SerpAPI mapping, Demo Mode, tests, and README drafts. Suggestions were reviewed against Expo SDK 57 docs and the assignment checklist before keeping them.

## One reviewed suggestion

An early suggestion put API fetching and response mapping directly inside ResultsScreen. That was rejected because the assignment requires SerpAPI communication and conversion outside screen components. Fetching stayed in `serpApi.ts` and mapping in `flightMapper.ts`, with the screen only orchestrating UI state.

## One problem solved

Rapid Search presses could fire multiple requests. Cause: no in-flight guard beyond React state, which updates asynchronously. Fix: a `loadingRef` in `useFlightSearch` plus disabling the Search button while `loading` is true.

## Limitations

- Date inputs are plain `YYYY-MM-DD` text fields (no calendar picker).
- Round-trip only in the UI (API supports one-way via the model).
- Live round-trip results use SerpAPI’s outbound list; return-leg deep linking via `departure_token` was not implemented.
- No production web deployment included; local `npm run web` / `expo export` instructions are provided instead.
- Visual design is functional rather than highly polished.
