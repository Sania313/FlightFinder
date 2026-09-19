import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Flight } from '../models/flight';
import { useSavedFlightsContext } from '../context/SavedFlightsContext';
import { formatDateTime, formatDuration, formatPrice, formatStops } from '../utils/format';
import { colors } from '../theme/colors';

type DetailsRoute = RouteProp<{ Details: { flight: Flight } }, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsRoute>();
  const flight = (route.params as { flight: Flight }).flight;
  const { isSaved, add, remove } = useSavedFlightsContext();
  const saved = isSaved(flight.id);

  const toggleSave = async () => {
    if (saved) {
      await remove(flight.id);
    } else {
      await add(flight);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {flight.isDemo ? (
        <View style={styles.demoBanner}>
          <Text style={styles.demoText}>Sample data — Demo Mode</Text>
        </View>
      ) : null}

      <Text style={styles.airline}>{flight.airline}</Text>
      <Text style={styles.route}>
        {flight.origin} → {flight.destination}
      </Text>
      <Text style={styles.price}>{formatPrice(flight.price)}</Text>

      <View style={styles.metaBox}>
        <MetaRow label="Departure" value={formatDateTime(flight.departureTime)} />
        <MetaRow label="Arrival" value={formatDateTime(flight.arrivalTime)} />
        <MetaRow label="Duration" value={formatDuration(flight.duration)} />
        <MetaRow label="Stops" value={formatStops(flight.stops)} />
        {flight.aircraft ? <MetaRow label="Aircraft" value={flight.aircraft} /> : null}
      </View>

      <Text style={styles.sectionTitle}>Itinerary</Text>
      {flight.segments.map((segment, index) => (
        <View key={`${segment.flightNumber ?? segment.airline}-${index}`} style={styles.segment}>
          <Text style={styles.segmentTitle}>
            {segment.airline}
            {segment.flightNumber ? ` · ${segment.flightNumber}` : ''}
          </Text>
          <Text style={styles.segmentRoute}>
            {segment.origin} → {segment.destination}
          </Text>
          {segment.originName || segment.destinationName ? (
            <Text style={styles.segmentAirports}>
              {[segment.originName, segment.destinationName].filter(Boolean).join(' → ')}
            </Text>
          ) : null}
          <Text style={styles.segmentMeta}>
            {formatDateTime(segment.departureTime)} → {formatDateTime(segment.arrivalTime)} ·{' '}
            {formatDuration(segment.duration)}
          </Text>
          {segment.aircraft ? (
            <Text style={styles.segmentMeta}>{segment.aircraft}</Text>
          ) : null}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.saveButton, saved && styles.saveButtonActive]}
        onPress={toggleSave}
        accessibilityRole="button"
      >
        <Text style={styles.saveButtonText}>{saved ? 'Remove from saved' : 'Save flight'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  demoBanner: {
    backgroundColor: colors.demoBg,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  demoText: {
    color: colors.demo,
    fontWeight: '600',
  },
  airline: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  route: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent,
    marginTop: 8,
    marginBottom: 16,
  },
  metaBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  metaValue: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  segment: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  segmentTitle: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  segmentRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  segmentAirports: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  segmentMeta: {
    color: colors.textMuted,
    marginTop: 6,
    fontSize: 13,
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonActive: {
    backgroundColor: colors.accent,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
