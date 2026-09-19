# FlightFinder

Cross-platform flight search app built with React Native, TypeScript, and Expo (SDK 57). Runs on mobile and web. Live results use SerpAPI Google Flights; reviewers can use **Demo Mode** without an API key.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and add your SerpAPI key (optional if you only use Demo Mode):

```bash
cp .env.example .env
```

Edit `.env`:

```
EXPO_PUBLIC_SERPAPI_KEY=your_serpapi_key_here
```

Never commit a real API key. `.env` is gitignored.

3. Start the app:

```bash
npm start
```

Then press `w` for web, `a` for Android, or `i` for iOS (simulator/device via Expo Go).

### Useful scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run web` | Open web |
| `npm run android` | Open Android |
| `npm run ios` | Open iOS |
| `npm test` | Run automated tests |

## Demo Mode

On the Search screen, turn on **Demo Mode**. Search uses a local sample dataset (`src/data/demoFlights.ts`) so sorting, filtering, details, and saving work without network access or credentials. Sample results are labelled clearly.

Suggested demo search: **YYZ → LHR**, future departure/return dates, 1 passenger, round trip (pre-filled on the form).

## Manual test checklist

- [ ] Validation: empty origin/destination, same airports, missing departure, return before departure, passengers &lt; 1
- [ ] Demo Mode: multiple results, sort by lowest price, non-stop filter
- [ ] Open a result → details show itinerary segments
- [ ] Save a flight → appears on Saved tab after restart
- [ ] Saving the same flight twice does not create duplicates
- [ ] Live search (with key): loading state; Search button disabled while loading
- [ ] Error path: invalid key or offline → error message + Use Demo Mode
- [ ] Layout readable at phone width and in a desktop browser

## Project structure (important files)

- `src/services/serpApi.ts` — SerpAPI request
- `src/services/flightMapper.ts` — response → app `Flight` model
- `src/data/demoFlights.ts` — Demo Mode sample data
- `src/storage/savedFlights.ts` — AsyncStorage persistence
- `src/screens/*` — Search, Results, Details, Saved
- `src/utils/validation.ts` — search validation

## Build

For a production web export:

```bash
npx expo export --platform web
```

For native builds, use EAS Build or a local Expo prebuild workflow as needed.

## Limitations

See `DEVELOPMENT-NOTES.md`.
