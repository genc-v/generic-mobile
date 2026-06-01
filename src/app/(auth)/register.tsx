import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Brand } from '../../components/ui/brand';
import { PrimaryBtn } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useRegister } from '../../viewmodels/useRegister';
import { styles } from '../../styles/auth/register.styles';

export default function Register() {
  const vm = useRegister();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Brand size={28} />
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Free for personal projects.</Text>
          <Input label="Email" placeholder="you@example.com" value={vm.email} onChangeText={vm.setEmail} keyboardType="email-address" autoComplete="email" />
          <Input label="Username" placeholder="username" value={vm.username} onChangeText={vm.setUsername} autoComplete="username" />
          <Input label="Password" placeholder="••••••••" value={vm.password} onChangeText={vm.setPassword} secureTextEntry autoComplete="new-password" />
          <Input label="Confirm password" placeholder="••••••••" value={vm.confirmPassword} onChangeText={vm.setConfirmPassword} secureTextEntry note={vm.passwordMismatch ? "Passwords don't match." : undefined} autoComplete="new-password" />
          {vm.error && <Text style={styles.error}>{vm.error}</Text>}
          <View style={styles.btnWrap}>
            <PrimaryBtn label="Create account" full onPress={vm.handleRegister} loading={vm.loading} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={vm.goToLogin}>
              <Text style={styles.footerLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
