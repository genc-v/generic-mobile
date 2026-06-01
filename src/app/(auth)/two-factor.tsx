import { useRef, useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, Easing,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Brand } from '../../components/ui/brand';
import { PrimaryBtn } from '../../components/ui/button';
import { DS } from '../../constants/ds';
import { authService } from '../../services/auth.service';

const DIGIT_COUNT = 6;

export default function TwoFactor() {
  const router = useRouter();
  const { twoFactorId } = useLocalSearchParams<{ twoFactorId: string }>();
  const inputRef = useRef<TextInput>(null);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  // Blinking cursor animation
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

  // Auto-focus on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  const handleChange = useCallback((text: string) => {
    const numeric = text.replace(/[^0-9]/g, '').slice(0, DIGIT_COUNT);
    setCode(numeric);
    setError(null);
  }, []);

  async function handleVerify() {
    if (code.length < DIGIT_COUNT) {
      setError('Enter the full 6-digit code.');
      return;
    }
    if (!twoFactorId) {
      setError('Session expired. Please log in again.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await authService.verify2fa(twoFactorId, code);
      if (!result.success || !result.data) {
        setError('Invalid code. Please try again.');
        setCode('');
        inputRef.current?.focus();
        return;
      }
      router.replace('/(app)');
    } catch {
      setError('Something went wrong. Please try again.');
      setCode('');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  const activeIndex = Math.min(code.length, DIGIT_COUNT - 1);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      {/* Hidden real input that captures keyboard */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={code}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={DIGIT_COUNT}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        caretHidden
        importantForAutofill="no"
        textContentType="oneTimeCode"
      />

      <View style={styles.container}>
        <Brand size={28} />
        <Text style={styles.title}>Two-factor authentication</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code from your authenticator app.
        </Text>

        {/* Digit boxes — tap to (re)focus keyboard */}
        <TouchableOpacity
          style={styles.digitRow}
          onPress={() => inputRef.current?.focus()}
          activeOpacity={1}
        >
          {Array.from({ length: DIGIT_COUNT }).map((_, i) => {
            const char = code[i] ?? '';
            const isActive = focused && i === activeIndex && char === '';
            const isFilled = char !== '';
            return (
              <View
                key={i}
                style={[
                  styles.digitBox,
                  isActive && styles.digitBoxActive,
                  isFilled && styles.digitBoxFilled,
                ]}
              >
                {isFilled ? (
                  <Text style={styles.digitText}>{char}</Text>
                ) : isActive ? (
                  <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
                ) : null}
              </View>
            );
          })}
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}

        <PrimaryBtn label="Verify" full onPress={handleVerify} loading={loading} />
        <TouchableOpacity style={styles.backWrap} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.back}>Back to log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.bg,
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: DS.text1,
    marginTop: 24,
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 14,
    color: DS.text2,
    marginTop: 6,
    marginBottom: 36,
    letterSpacing: -0.15,
    lineHeight: 20,
  },
  digitRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  digitBox: {
    flex: 1,
    height: 60,
    borderRadius: 8,
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitBoxActive: {
    borderColor: 'rgba(255,255,255,0.35)',
  },
  digitBoxFilled: {
    borderColor: DS.border2,
  },
  digitText: {
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
  error: {
    fontSize: 13,
    color: DS.red,
    fontWeight: '500',
    marginBottom: 12,
  },
  backWrap: {
    alignItems: 'center',
    marginTop: 18,
  },
  back: {
    fontSize: 13,
    color: DS.text1,
    textDecorationLine: 'underline',
    letterSpacing: -0.15,
  },
});
