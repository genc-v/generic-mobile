import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { DS } from '../../constants/ds';

type Props = { title: string; right?: ReactNode };

export function TopBar({ title, right }: Props) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()} hitSlop={12}>
        <Svg width={10} height={16} viewBox="0 0 9 14" fill="none">
          <Path d="M7.5 1L1.5 7L7.5 13" stroke={DS.text2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.spacer}>{right ?? null}</View>
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
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: DS.text1,
    letterSpacing: -0.3,
  },
  spacer: { minWidth: 28, alignItems: 'flex-end' },
});
