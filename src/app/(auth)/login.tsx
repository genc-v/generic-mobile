import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Brand } from '../../components/ui/brand';
import { PrimaryBtn } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { DS } from '../../constants/ds';
import { authService } from '../../services/auth.service';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (!result.success || !result.data) {
        setError('Invalid email or password.');
        return;
      }
      if (result.data.twoFactorId !== null) {
        router.replace({ pathname: '/(auth)/two-factor', params: { twoFactorId: result.data.twoFactorId } });
      } else {
        router.replace('/(app)');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Brand size={28} />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue.</Text>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
          <TouchableOpacity style={styles.forgotWrap}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.btnWrap}>
            <PrimaryBtn label="Log in" full onPress={handleLogin} loading={loading} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
              <Text style={styles.footerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.bg,
  },
  container: {
    padding: 24,
    paddingTop: 24,
    flexGrow: 1,
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
    marginBottom: 28,
    letterSpacing: -0.15,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 14,
  },
  forgot: {
    fontSize: 12,
    color: DS.text2,
    textDecorationLine: 'underline',
  },
  error: {
    fontSize: 13,
    color: DS.red,
    fontWeight: '500',
    marginBottom: 12,
  },
  btnWrap: {
    marginTop: 6,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: DS.text2,
    letterSpacing: -0.15,
  },
  footerLink: {
    fontSize: 13,
    color: DS.text1,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
