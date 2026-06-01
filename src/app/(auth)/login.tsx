import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Brand } from '../../components/ui/brand';
import { PrimaryBtn } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useLogin } from '../../viewmodels/useLogin';
import { styles } from '../../styles/auth/login.styles';

export default function Login() {
  const vm = useLogin();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Brand size={28} />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue.</Text>
          <Input label="Email" placeholder="you@example.com" value={vm.email} onChangeText={vm.setEmail} keyboardType="email-address" autoComplete="email" />
          <Input label="Password" placeholder="••••••••" value={vm.password} onChangeText={vm.setPassword} secureTextEntry autoComplete="password" />
          <TouchableOpacity style={styles.forgotWrap}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>
          {vm.error && <Text style={styles.error}>{vm.error}</Text>}
          <View style={styles.btnWrap}>
            <PrimaryBtn label="Log in" full onPress={vm.handleLogin} loading={vm.loading} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={vm.goToRegister}>
              <Text style={styles.footerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
