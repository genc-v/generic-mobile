import { View, Text, StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

type Props = { size?: number };

export function Brand({ size = 24 }: Props) {
  const radius = Math.round(size * 0.25);
  const fontSize = Math.round(size * 0.5);
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: radius }]}>
      <Text style={[styles.letter, { fontSize }]}>g</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DS.accentStrong,
  },
  letter: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: undefined,
  },
});
