import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

interface Props extends ViewProps {
  children: React.ReactNode;
}

/** Soft sky gradient behind every main screen. */
export default function ScreenBackground({ children, style, ...rest }: Props) {
  return (
    <View style={[styles.root, style]} {...rest}>
      <LinearGradient
        colors={[colors.backgroundDeep, colors.background, '#F7FBFD']}
        locations={[0, 0.45, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowBottom} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(11, 95, 122, 0.12)',
    zIndex: 0,
  },
  glowBottom: {
    position: 'absolute',
    bottom: 40,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(226, 109, 45, 0.08)',
    zIndex: 0,
  },
});
