import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, typography } from '../theme/colors';
import { SearchError } from '../models/flight';
import FadeInView from './FadeInView';
import PressableScale from './PressableScale';
import ScreenBackground from './ScreenBackground';

interface Props {
  error: SearchError;
  onRetry?: () => void;
  onUseSample?: () => void;
}

export default function ErrorState({ error, onRetry, onUseSample }: Props) {
  const title =
    error.kind === 'rate_limit'
      ? 'Live search unavailable'
      : error.kind === 'network'
        ? 'Couldn’t reach live flights'
        : 'Something went wrong';

  return (
    <ScreenBackground>
      <FadeInView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Live search</Text>
          </View>
          <Text style={styles.kicker}>{title}</Text>
          <Text style={styles.message}>{error.message}</Text>
          <View style={styles.actions}>
            {onRetry ? (
              <PressableScale style={styles.secondary} onPress={onRetry} accessibilityRole="button">
                <Text style={styles.secondaryText}>Retry</Text>
              </PressableScale>
            ) : null}
            {onUseSample ? (
              <PressableScale style={styles.primary} onPress={onUseSample} accessibilityRole="button">
                <Text style={styles.primaryText}>Try sample data</Text>
              </PressableScale>
            ) : null}
          </View>
          <Text style={styles.footnote}>
            Sample data works offline and needs no API key.
          </Text>
        </View>
      </FadeInView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 22,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.errorBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.sm,
    marginBottom: 12,
  },
  badgeText: {
    color: colors.error,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  kicker: {
    ...typography.title,
    fontSize: 20,
    color: colors.text,
    marginBottom: 10,
  },
  message: {
    ...typography.subtitle,
    color: colors.textMuted,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primary: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii.sm,
  },
  primaryText: {
    color: colors.white,
    fontWeight: '700',
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii.sm,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '700',
  },
  footnote: {
    marginTop: 16,
    color: colors.textMuted,
    fontSize: 13,
  },
});
