import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchParams } from '../models/flight';
import { validateSearch } from '../utils/validation';
import { colors, radii, typography } from '../theme/colors';
import FadeInView from './FadeInView';
import PressableScale from './PressableScale';

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

      <FadeInView delay={80} style={styles.demoRow}>
        <View style={styles.demoCopy}>
          <Text style={styles.demoTitle}>Demo Mode</Text>
          <Text style={styles.demoHint}>Sample data — no API key required.</Text>
        </View>
        <Switch
          value={demoMode}
          onValueChange={setDemoMode}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={colors.white}
          accessibilityLabel="Demo Mode"
        />
      </FadeInView>

      <FadeInView delay={140} style={styles.formCard}>
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
          onPress={handleSearch}
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
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.demoBg,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(138, 90, 0, 0.12)',
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
  error: {
    color: colors.error,
    marginBottom: 12,
    fontWeight: '600',
  },
});
