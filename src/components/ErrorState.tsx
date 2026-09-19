import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { SearchError } from '../models/flight';

interface Props {
  error: SearchError;
  onRetry?: () => void;
  onUseDemo?: () => void;
}

export default function ErrorState({ error, onRetry, onUseDemo }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {error.kind === 'rate_limit' ? 'Live search unavailable' : 'Something went wrong'}
      </Text>
      <Text style={styles.message}>{error.message}</Text>
      <View style={styles.actions}>
        {onRetry ? (
          <TouchableOpacity style={styles.secondary} onPress={onRetry} accessibilityRole="button">
            <Text style={styles.secondaryText}>Retry</Text>
          </TouchableOpacity>
        ) : null}
        {onUseDemo ? (
          <TouchableOpacity style={styles.primary} onPress={onUseDemo} accessibilityRole="button">
            <Text style={styles.primaryText}>Use Demo Mode</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.errorBg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '600',
  },
});
