import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, typography } from '../theme/colors';
import FadeInView from './FadeInView';

interface Props {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: Props) {
  return (
    <FadeInView style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>···</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  icon: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    ...typography.title,
    fontSize: 18,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    ...typography.subtitle,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 320,
  },
});
