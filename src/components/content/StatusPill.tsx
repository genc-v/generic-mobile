import { View, Text, StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

type Props = { label: string; color: string };

export function StatusPill({ label, color }: Props) {
  return (
    <View style={styles.pill}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export const STATUS_COLOR: Record<string, string> = {
  Published: DS.green,
  Draft: DS.amber,
  New: DS.text3,
  Unpublished: DS.orange,
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: DS.text1,
    letterSpacing: -0.1,
  },
});
