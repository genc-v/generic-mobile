import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast, ToastEntry, ToastType } from '../../utils/toast';
import { DS } from '../../constants/ds';

const SHOW_MS = 260;
const HIDE_MS = 220;
const DISPLAY_MS = 3400;
const MAX_VISIBLE = 3;

const TYPE_STYLE: Record<ToastType, { dot: string; bg: string; border: string }> = {
  error: { dot: DS.red, bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.28)' },
  success: { dot: DS.green, bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.28)' },
  info: { dot: DS.accent, bg: DS.surface2, border: DS.border },
};

function ToastItem({ entry, onDone }: { entry: ToastEntry; onDone: (id: number) => void }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: SHOW_MS });
    translateY.value = withTiming(0, { duration: SHOW_MS });

    const t = setTimeout(() => {
      opacity.value = withTiming(0, { duration: HIDE_MS });
      translateY.value = withTiming(14, { duration: HIDE_MS }, (finished) => {
        if (finished) runOnJS(onDone)(entry.id);
      });
    }, DISPLAY_MS);

    return () => clearTimeout(t);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const ts = TYPE_STYLE[entry.type];

  return (
    <Animated.View style={[styles.toast, { backgroundColor: ts.bg, borderColor: ts.border }, animStyle]}>
      <View style={[styles.dot, { backgroundColor: ts.dot }]} />
      <Text style={styles.text} numberOfLines={3}>{entry.message}</Text>
    </Animated.View>
  );
}

export function ToastContainer() {
  const [items, setItems] = useState<ToastEntry[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    return toast._subscribe(entry => {
      setItems(prev => {
        const next = [...prev, entry];
        return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next;
      });
    });
  }, []);

  const remove = useCallback((id: number) => {
    setItems(prev => prev.filter(e => e.id !== id));
  }, []);

  if (items.length === 0) return null;

  return (
    <View
      style={[styles.container, { bottom: insets.bottom + 16 }]}
      pointerEvents="none"
    >
      {items.map(item => (
        <ToastItem key={item.id} entry={item} onDone={remove} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    gap: 8,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 4,
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: DS.text1,
    lineHeight: 19,
    letterSpacing: -0.1,
  },
});
