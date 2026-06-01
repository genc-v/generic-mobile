import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { DS } from '../../constants/ds';

type Props = { title: string };

export function TopBar({ title }: Props) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()} hitSlop={12}>
        <View style={styles.chevL1} />
        <View style={styles.chevL2} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
  },
  back: {
    width: 28,
    height: 28,
    justifyContent: 'center',
  },
  chevL1: {
    position: 'absolute',
    width: 1.4,
    height: 7,
    backgroundColor: DS.text2,
    borderRadius: 1,
    left: 8,
    top: 4,
    transform: [{ rotate: '-45deg' }],
  },
  chevL2: {
    position: 'absolute',
    width: 1.4,
    height: 7,
    backgroundColor: DS.text2,
    borderRadius: 1,
    left: 8,
    bottom: 4,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: DS.text1,
    letterSpacing: -0.3,
  },
  spacer: { width: 28 },
});
