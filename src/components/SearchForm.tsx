import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SearchParams } from '../models/flight';
import { validateSearch } from '../utils/validation';
import { colors } from '../theme/colors';

interface Props {
  onSearch: (params: SearchParams, demoMode: boolean) => void;
  loading?: boolean;
  initialDemoMode?: boolean;
}

function defaultFutureDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

export default function SearchForm({ onSearch, loading = false, initialDemoMode = false }: Props) {
  const [origin, setOrigin] = useState('YYZ');
  const [destination, setDestination] = useState('LHR');
  const [departureDate, setDepartureDate] = useState(defaultFutureDate(30));
  const [returnDate, setReturnDate] = useState(defaultFutureDate(37));
  const [passengers, setPassengers] = useState('1');
  const [demoMode, setDemoMode] = useState(initialDemoMode);
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (loading) {
      return;
    }

    const params: SearchParams = {
      origin: origin.trim().toUpperCase(),
      destination: destination.trim().toUpperCase(),
      departureDate: departureDate.trim(),
      returnDate: returnDate.trim(),
      passengers: parseInt(passengers, 10) || 0,
      tripType: 'round-trip',
    };

    const result = validateSearch(params);
    if (!result.isValid) {
      setError(result.message);
      return;
    }

    setError('');
    onSearch(params, demoMode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>FlightFinder</Text>
      <Text style={styles.subheading}>Search round-trip flights for mobile and web.</Text>

      <View style={styles.demoRow}>
        <View style={styles.demoCopy}>
          <Text style={styles.demoTitle}>Demo Mode</Text>
          <Text style={styles.demoHint}>
            Uses sample data — no API key or internet required.
          </Text>
        </View>
        <Switch
          value={demoMode}
          onValueChange={setDemoMode}
          trackColor={{ false: colors.border, true: colors.accent }}
          accessibilityLabel="Demo Mode"
        />
      </View>

      <Text style={styles.label}>Origin</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. YYZ"
        value={origin}
        onChangeText={setOrigin}
        autoCapitalize="characters"
        autoCorrect={false}
        editable={!loading}
      />

      <Text style={styles.label}>Destination</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. LHR"
        value={destination}
        onChangeText={setDestination}
        autoCapitalize="characters"
        autoCorrect={false}
        editable={!loading}
      />

      <Text style={styles.label}>Departure date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={departureDate}
        onChangeText={setDepartureDate}
        editable={!loading}
      />

      <Text style={styles.label}>Return date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={returnDate}
        onChangeText={setReturnDate}
        editable={!loading}
      />

      <Text style={styles.label}>Passengers</Text>
      <TextInput
        style={styles.input}
        placeholder="1"
        value={passengers}
        onChangeText={setPassengers}
        keyboardType="numeric"
        editable={!loading}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSearch}
        disabled={loading}
        accessibilityRole="button"
        accessibilityState={{ disabled: loading }}
      >
        <Text style={styles.buttonText}>{loading ? 'Searching…' : 'Search'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  subheading: {
    color: colors.textMuted,
    marginBottom: 20,
    fontSize: 15,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.demoBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    gap: 12,
  },
  demoCopy: {
    flex: 1,
  },
  demoTitle: {
    fontWeight: '700',
    color: colors.demo,
    marginBottom: 2,
  },
  demoHint: {
    color: colors.textMuted,
    fontSize: 13,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  error: {
    color: colors.error,
    marginBottom: 12,
  },
});
