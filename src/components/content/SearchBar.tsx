import { View, TextInput, StyleSheet } from 'react-native';
import { Svg, Circle, Line } from 'react-native-svg';
import { DS } from '../../constants/ds';

type Props = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
};

export function SearchBar({ placeholder = 'Search…', value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <Circle cx={6} cy={6} r={4.5} stroke={DS.text3} strokeWidth={1.3} />
        <Line x1={9.5} y1={9.5} x2={12} y2={12} stroke={DS.text3} strokeWidth={1.3} strokeLinecap="round" />
      </Svg>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={DS.text3}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 10,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: DS.border,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: DS.text1,
    padding: 0,
    letterSpacing: -0.1,
  },
});
