import { validateSearch } from '../src/utils/validation';
import { SearchParams } from '../src/models/flight';
import { mapSerpFlightsResponse } from '../src/services/flightMapper';
import { applySortAndFilter } from '../src/utils/sortFilter';
import { DEMO_FLIGHTS } from '../src/data/demoFlights';

describe('validateSearch', () => {
  const base: SearchParams = {
    origin: 'YYZ',
    destination: 'LHR',
    departureDate: '2026-10-15',
    returnDate: '2026-10-22',
    passengers: 1,
    tripType: 'round-trip',
  };

  it('rejects missing origin or destination', () => {
    expect(validateSearch({ ...base, origin: '' }).isValid).toBe(false);
    expect(validateSearch({ ...base, destination: '  ' }).isValid).toBe(false);
  });

  it('rejects same origin and destination', () => {
    const result = validateSearch({ ...base, destination: 'yyz' });
    expect(result.isValid).toBe(false);
    expect(result.message).toMatch(/same/i);
  });

  it('rejects return before departure', () => {
    const result = validateSearch({
      ...base,
      departureDate: '2026-10-22',
      returnDate: '2026-10-15',
    });
    expect(result.isValid).toBe(false);
  });

  it('accepts a valid round-trip search', () => {
    expect(validateSearch(base).isValid).toBe(true);
  });
});

describe('mapSerpFlightsResponse', () => {
  it('maps best_flights and other_flights into Flight models', () => {
    const flights = mapSerpFlightsResponse({
      best_flights: [
        {
          flights: [
            {
              departure_airport: { id: 'YYZ', name: 'Toronto', time: '2026-10-15 18:30' },
              arrival_airport: { id: 'LHR', name: 'London', time: '2026-10-16 06:45' },
              duration: 435,
              airline: 'Air Canada',
              flight_number: 'AC 870',
              airplane: 'Boeing 777',
            },
          ],
          total_duration: 435,
          price: 720,
          airline_logo: 'https://example.com/ac.png',
        },
      ],
      other_flights: [
        {
          flights: [
            {
              departure_airport: { id: 'YYZ', time: '2026-10-15 14:00' },
              arrival_airport: { id: 'YUL', time: '2026-10-15 15:15' },
              duration: 75,
              airline: 'Air Transat',
              flight_number: 'TS 24',
            },
            {
              departure_airport: { id: 'YUL', time: '2026-10-15 17:40' },
              arrival_airport: { id: 'LHR', time: '2026-10-16 07:20' },
              duration: 400,
              airline: 'Air Transat',
              flight_number: 'TS 114',
            },
          ],
          layovers: [{ id: 'YUL' }],
          total_duration: 620,
          price: 540,
        },
      ],
    });

    expect(flights).toHaveLength(2);
    expect(flights[0].airline).toBe('Air Canada');
    expect(flights[0].stops).toBe(0);
    expect(flights[0].segments).toHaveLength(1);
    expect(flights[1].stops).toBe(1);
    expect(flights[1].segments).toHaveLength(2);
  });

  it('returns an empty list for invalid payloads', () => {
    expect(mapSerpFlightsResponse(null)).toEqual([]);
    expect(mapSerpFlightsResponse({})).toEqual([]);
  });
});

describe('applySortAndFilter', () => {
  it('filters non-stop and sorts by lowest price', () => {
    const result = applySortAndFilter(DEMO_FLIGHTS, 'price_asc', true);
    expect(result.every((f) => f.stops === 0)).toBe(true);
    for (let i = 1; i < result.length; i += 1) {
      const prev = result[i - 1].price ?? Number.POSITIVE_INFINITY;
      const curr = result[i].price ?? Number.POSITIVE_INFINITY;
      expect(prev).toBeLessThanOrEqual(curr);
    }
  });
});
