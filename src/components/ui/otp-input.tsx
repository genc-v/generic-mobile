import { useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

const DIGIT_COUNT = 6;

type Props = {
  value: string;
  onChange: (v: string) => void;
  focused: boolean;
  onFocusChange: (f: boolean) => void;
  digitHeight?: number;
};

export function OtpInput({ value, onChange, focused, onFocusChange, digitHeight = 60 }: Props) {
  const inputRef = useRef<TextInput>(null);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: true, easing: Easing.step0 }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: true, easing: Easing.step0 }),
      ])
    );
    if (focused) {
      blink.start();
    } else {
      blink.stop();
      cursorOpacity.setValue(1);
    }
    return () => blink.stop();
  }, [focused, cursorOpacity]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const activeIndex = Math.min(value.length, DIGIT_COUNT - 1);

  return (
    <>
      <TextInput
        ref={inputRef}
        style={styles.hidden}
        value={value}
        onChangeText={v => onChange(v.replace(/[^0-9]/g, '').slice(0, DIGIT_COUNT))}
        keyboardType="number-pad"
        maxLength={DIGIT_COUNT}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        caretHidden
        textContentType="oneTimeCode"
        importantForAutofill="no"
      />
      <TouchableOpacity
        style={styles.row}
        onPress={() => inputRef.current?.focus()}
        activeOpacity={1}
      >
        {Array.from({ length: DIGIT_COUNT }).map((_, i) => {
          const char = value[i] ?? '';
          const isActive = focused && i === activeIndex && char === '';
          return (
            <View
              key={i}
              style={[
                styles.box,
                { height: digitHeight },
                isActive && styles.boxActive,
              ]}
            >
              {char !== '' ? (
                <Animated.Text style={styles.digit}>{char}</Animated.Text>
              ) : isActive ? (
                <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
              ) : null}
            </View>
          );
        })}
      </TouchableOpacity>
    </>
  );
}

export { DIGIT_COUNT };

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  box: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: {
    borderColor: 'rgba(255,255,255,0.35)',
  },
  digit: {
    fontSize: 22,
    fontWeight: '500',
    color: DS.text1,
    fontVariant: ['tabular-nums'],
  },
  cursor: {
    width: 1.5,
    height: 24,
    backgroundColor: DS.text1,
    borderRadius: 1,
  },
});
