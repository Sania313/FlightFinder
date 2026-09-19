import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Flight } from '../models/flight';
import { useSavedFlightsContext } from '../context/SavedFlightsContext';
import { formatDateTime, formatDuration, formatPrice, formatStops } from '../utils/format';
import { colors, radii, typography } from '../theme/colors';
import ScreenBackground from '../components/ScreenBackground';
import FadeInView from '../components/FadeInView';
import PressableScale from '../components/PressableScale';

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
    <ScreenBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView>
          {flight.isDemo ? (
            <View style={styles.demoBanner}>
              <Text style={styles.demoText}>Sample data · not live prices</Text>
            </View>
          ) : null}

          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <Text style={styles.heroAirline}>{flight.airline}</Text>
            <View style={styles.heroRoute}>
              <Text style={styles.heroCode}>{flight.origin}</Text>
              <Text style={styles.heroArrow}>→</Text>
              <Text style={styles.heroCode}>{flight.destination}</Text>
            </View>
            <Text style={styles.heroPrice}>{formatPrice(flight.price)}</Text>
          </LinearGradient>
        </FadeInView>

        <FadeInView delay={90} style={styles.metaBox}>
          <MetaRow label="Departure" value={formatDateTime(flight.departureTime)} />
          <MetaRow label="Arrival" value={formatDateTime(flight.arrivalTime)} />
          <MetaRow label="Duration" value={formatDuration(flight.duration)} />
          <MetaRow label="Stops" value={formatStops(flight.stops)} />
          {flight.aircraft ? <MetaRow label="Aircraft" value={flight.aircraft} /> : null}
        </FadeInView>

        <FadeInView delay={150}>
          <Text style={styles.sectionTitle}>Itinerary</Text>
          {flight.segments.map((segment, index) => (
            <View
              key={`${segment.flightNumber ?? segment.airline}-${index}`}
              style={styles.segment}
            >
              <View style={styles.segmentIndex}>
                <Text style={styles.segmentIndexText}>{index + 1}</Text>
              </View>
              <View style={styles.segmentBody}>
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
            </View>
          ))}
        </FadeInView>

        <FadeInView delay={220}>
          <PressableScale onPress={toggleSave} accessibilityRole="button">
            <LinearGradient
              colors={saved ? [colors.accent, '#C45A1F'] : [colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>
                {saved ? 'Remove from saved' : 'Save flight'}
              </Text>
            </LinearGradient>
          </PressableScale>
        </FadeInView>
      </ScrollView>
    </ScreenBackground>
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
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  demoBanner: {
    backgroundColor: colors.demoBg,
    padding: 10,
    borderRadius: radii.sm,
    marginBottom: 12,
  },
  demoText: {
    color: colors.demo,
    fontWeight: '700',
  },
  hero: {
    borderRadius: radii.lg,
    padding: 20,
    marginBottom: 14,
  },
  heroAirline: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    marginBottom: 8,
  },
  heroRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroCode: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroArrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 20,
  },
  heroPrice: {
    marginTop: 14,
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  metaBox: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 16,
    marginBottom: 20,
    gap: 12,
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
    fontWeight: '700',
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'right',
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 17,
    color: colors.text,
    marginBottom: 12,
  },
  segment: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 12,
  },
  segmentIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentIndexText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  segmentBody: {
    flex: 1,
  },
  segmentTitle: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  segmentRoute: {
    fontSize: 16,
    fontWeight: '700',
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
    marginTop: 8,
    paddingVertical: 15,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
});
