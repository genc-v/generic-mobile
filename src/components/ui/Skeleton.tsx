import { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle, DimensionValue, Easing } from 'react-native';
import { DS } from '../../constants/ds';

type Props = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

// A single pulsing placeholder block. Compose these to mirror real layouts.
export function Skeleton({ width = '100%', height = 14, radius = 6, style }: Props) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius, backgroundColor: DS.surface3, opacity: pulse }, style]}
    />
  );
}
