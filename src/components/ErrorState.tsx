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
  onUseDemo?: () => void;
}

export default function ErrorState({ error, onRetry, onUseDemo }: Props) {
  return (
    <ScreenBackground>
      <FadeInView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.kicker}>
            {error.kind === 'rate_limit' ? 'Live search unavailable' : 'Something went wrong'}
          </Text>
          <Text style={styles.message}>{error.message}</Text>
          <View style={styles.actions}>
            {onRetry ? (
              <PressableScale style={styles.secondary} onPress={onRetry} accessibilityRole="button">
                <Text style={styles.secondaryText}>Retry</Text>
              </PressableScale>
            ) : null}
            {onUseDemo ? (
              <PressableScale style={styles.primary} onPress={onUseDemo} accessibilityRole="button">
                <Text style={styles.primaryText}>Use Demo Mode</Text>
              </PressableScale>
            ) : null}
          </View>
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
  kicker: {
    ...typography.title,
    fontSize: 18,
    color: colors.error,
    marginBottom: 10,
  },
  message: {
    ...typography.subtitle,
    color: colors.text,
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
});
