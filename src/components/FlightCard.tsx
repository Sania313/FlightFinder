import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Flight } from '../models/flight';
import { formatDateTime, formatDuration, formatPrice, formatStops } from '../utils/format';
import { colors, radii, typography } from '../theme/colors';
import FadeInView from './FadeInView';
import PressableScale from './PressableScale';

interface Props {
  flight: Flight;
  onPress: () => void;
  index?: number;
}

export default function FlightCard({ flight, onPress, index = 0 }: Props) {
  return (
    <FadeInView delay={Math.min(index * 55, 280)}>
      <PressableScale
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
            <Text style={styles.airline} numberOfLines={1}>
              {flight.airline}
            </Text>
          </View>
          <View style={styles.priceWrap}>
            <Text style={styles.price}>{formatPrice(flight.price)}</Text>
          </View>
        </View>

        <View style={styles.route}>
          <View style={styles.airportCol}>
            <Text style={styles.code}>{flight.origin}</Text>
            <Text style={styles.time}>{formatDateTime(flight.departureTime)}</Text>
          </View>

          <View style={styles.mid}>
            <Text style={styles.duration}>{formatDuration(flight.duration)}</Text>
            <View style={styles.lineRow}>
              <View style={styles.dot} />
              <View style={styles.line} />
              <View style={[styles.dot, styles.dotEnd]} />
            </View>
            <Text style={styles.stops}>{formatStops(flight.stops)}</Text>
          </View>

          <View style={[styles.airportCol, styles.airportColEnd]}>
            <Text style={styles.code}>{flight.destination}</Text>
            <Text style={styles.time}>{formatDateTime(flight.arrivalTime)}</Text>
          </View>
        </View>

        {flight.isDemo ? (
          <View style={styles.demoBadge}>
            <Text style={styles.demoText}>Sample data</Text>
          </View>
        ) : null}
      </PressableScale>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  airlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitial: {
    color: colors.primary,
    fontWeight: '800',
  },
  airline: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  priceWrap: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.sm,
  },
  price: {
    ...typography.price,
    fontSize: 15,
    color: colors.accent,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  airportCol: {
    flex: 1,
  },
  airportColEnd: {
    alignItems: 'flex-end',
  },
  code: {
    ...typography.airport,
    fontSize: 20,
    color: colors.text,
  },
  time: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  mid: {
    flex: 1.2,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  duration: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primaryMuted,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dotEnd: {
    backgroundColor: colors.accent,
  },
  stops: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  demoBadge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: colors.demoBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  demoText: {
    color: colors.demo,
    fontSize: 12,
    fontWeight: '700',
  },
});
