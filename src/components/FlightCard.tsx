import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Flight } from '../models/flight';
import { formatDateTime, formatDuration, formatPrice, formatStops } from '../utils/format';
import { colors } from '../theme/colors';

interface Props {
  flight: Flight;
  onPress: () => void;
}

export default function FlightCard({ flight, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${flight.airline} ${flight.origin} to ${flight.destination}`}
    >
      <View style={styles.header}>
        <View style={styles.airlineRow}>
          {flight.airlineLogo ? (
            <Image source={{ uri: flight.airlineLogo }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoInitial}>{flight.airline.charAt(0)}</Text>
            </View>
          )}
          <Text style={styles.airline}>{flight.airline}</Text>
        </View>
        <Text style={styles.price}>{formatPrice(flight.price)}</Text>
      </View>

      <View style={styles.route}>
        <Text style={styles.code}>{flight.origin}</Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.code}>{flight.destination}</Text>
      </View>

      <Text style={styles.meta}>
        {formatDateTime(flight.departureTime)} · {formatDuration(flight.duration)} ·{' '}
        {formatStops(flight.stops)}
      </Text>

      {flight.isDemo ? (
        <View style={styles.demoBadge}>
          <Text style={styles.demoText}>Sample data</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  airlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 8,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  logoPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitial: {
    color: colors.primary,
    fontWeight: '700',
  },
  airline: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  code: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  arrow: {
    color: colors.textMuted,
    fontSize: 16,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  demoBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: colors.demoBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  demoText: {
    color: colors.demo,
    fontSize: 12,
    fontWeight: '600',
  },
});
