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

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  async function handleRegister() {
    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords don\'t match.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await authService.register(email, username, password);
      if (!result.success) {
        setError('Registration failed. Please try again.');
        return;
      }
      router.replace('/(app)');
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
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Free for personal projects.</Text>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
          />
          <Input
            label="Username"
            placeholder="username"
            value={username}
            onChangeText={setUsername}
            autoComplete="username"
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            note={passwordMismatch ? "Passwords don't match." : undefined}
            autoComplete="new-password"
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.btnWrap}>
            <PrimaryBtn label="Create account" full onPress={handleRegister} loading={loading} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.footerLink}>Log in</Text>
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
