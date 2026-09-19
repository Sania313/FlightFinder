import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme/colors';
import ScreenBackground from './ScreenBackground';

export default function LoadingState({ message = 'Searching flights…' }: { message?: string }) {
  const pulse = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.55,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <ScreenBackground>
      <View style={styles.container} accessibilityRole="progressbar">
        <Animated.View style={[styles.orb, { opacity: pulse, transform: [{ scale: pulse }] }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </Animated.View>
        <Text style={styles.text}>{message}</Text>
        <Text style={styles.hint}>Comparing routes and fares</Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  orb: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: 8,
  },
  text: {
    ...typography.title,
    fontSize: 18,
    color: colors.text,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
