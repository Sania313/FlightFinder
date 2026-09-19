import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchParams } from '../models/flight';
import { validateSearch } from '../utils/validation';
import { colors, radii, typography } from '../theme/colors';
import FadeInView from './FadeInView';
import PressableScale from './PressableScale';

interface Props {
  onSearch: (params: SearchParams, useSampleData: boolean) => void;
  loading?: boolean;
}

function defaultFutureDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

export default function SearchForm({ onSearch, loading = false }: Props) {
  const [origin, setOrigin] = useState('YYZ');
  const [destination, setDestination] = useState('LHR');
  const [departureDate, setDepartureDate] = useState(defaultFutureDate(30));
  const [returnDate, setReturnDate] = useState(defaultFutureDate(37));
  const [passengers, setPassengers] = useState('1');
  const [error, setError] = useState('');

  const buildParams = (): SearchParams | null => {
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
      return null;
    }

    setError('');
    return params;
  };

  const handleSearch = (useSampleData: boolean) => {
    if (loading) {
      return;
    }
    const params = buildParams();
    if (!params) {
      return;
    }
    onSearch(params, useSampleData);
  };

  const swapAirports = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <View style={styles.container}>
      <FadeInView>
        <Text style={styles.heading}>FlightFinder</Text>
        <Text style={styles.subheading}>Find round-trip fares for mobile and web.</Text>
      </FadeInView>

      <FadeInView delay={100} style={styles.formCard}>
        <View style={styles.routeBlock}>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Origin</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. DXB"
              placeholderTextColor={colors.textMuted}
              value={origin}
              onChangeText={setOrigin}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <PressableScale
            style={styles.swapButton}
            onPress={swapAirports}
            accessibilityRole="button"
            accessibilityLabel="Swap origin and destination"
            disabled={loading}
          >
            <Text style={styles.swapText}>⇄</Text>
          </PressableScale>

          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Destination</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. LHR"
              placeholderTextColor={colors.textMuted}
              value={destination}
              onChangeText={setDestination}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Departure</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              value={departureDate}
              onChangeText={setDepartureDate}
              editable={!loading}
            />
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Return</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              value={returnDate}
              onChangeText={setReturnDate}
              editable={!loading}
            />
          </View>
        </View>

        <Text style={styles.label}>Passengers</Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          placeholderTextColor={colors.textMuted}
          value={passengers}
          onChangeText={setPassengers}
          keyboardType="numeric"
          editable={!loading}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PressableScale
          onPress={() => handleSearch(false)}
          disabled={loading}
          accessibilityRole="button"
          accessibilityState={{ disabled: loading }}
          style={styles.buttonWrap}
        >
          <LinearGradient
            colors={
              loading
                ? [colors.primaryMuted, colors.primaryMuted]
                : [colors.primary, colors.primaryDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={[styles.buttonText, loading && styles.buttonTextDisabled]}>
              {loading ? 'Searching…' : 'Search flights'}
            </Text>
          </LinearGradient>
        </PressableScale>

        <PressableScale
          onPress={() => handleSearch(true)}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Try sample data without API"
          style={styles.sampleLinkWrap}
        >
          <Text style={styles.sampleLink}>No API? Try sample data</Text>
        </PressableScale>
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    ...typography.brand,
    color: colors.primaryDark,
    marginBottom: 6,
  },
  subheading: {
    ...typography.subtitle,
    color: colors.textMuted,
    marginBottom: 20,
    maxWidth: 420,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  routeBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldHalf: {
    flex: 1,
  },
  swapButton: {
    width: 40,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  swapText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  buttonWrap: {
    marginTop: 4,
  },
  button: {
    paddingVertical: 15,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  buttonTextDisabled: {
    color: colors.primaryDark,
  },
  sampleLinkWrap: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 4,
  },
  sampleLink: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  error: {
    color: colors.error,
    marginBottom: 12,
    fontWeight: '600',
  },
});
