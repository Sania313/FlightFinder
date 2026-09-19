import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleProp, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

/** Fade + slight upward slide on mount (safe on web + native). */
export default function FadeInView({
  children,
  delay = 0,
  duration = 420,
  style,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  // Web can be flaky with the native driver; keep animations on JS there.
  const useNativeDriver = Platform.OS !== 'web';

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
    ]);

    animation.start();

    const fallback = setTimeout(() => {
      opacity.setValue(1);
      translateY.setValue(0);
    }, delay + duration + 80);

    return () => {
      animation.stop();
      clearTimeout(fallback);
    };
  }, [delay, duration, opacity, translateY, useNativeDriver]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
