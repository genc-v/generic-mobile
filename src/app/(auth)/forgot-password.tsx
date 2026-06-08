import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Brand } from '../../components/ui/brand';
import { PrimaryBtn } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useForgotPassword } from '../../viewmodels/useForgotPassword';
import { styles } from '../../styles/auth/login.styles';

export default function ForgotPassword() {
  const vm = useForgotPassword();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Brand size={28} />
          <Text style={styles.title}>Forgot password</Text>
          {vm.sent ? (
            <>
              <Text style={styles.subtitle}>
                If an account exists for that email, we sent a reset code. Check your inbox and enter the code on the next screen.
              </Text>
              {vm.error && <Text style={styles.error}>{vm.error}</Text>}
              <View style={styles.btnWrap}>
                <PrimaryBtn label="Enter reset code" full onPress={vm.goToResetPassword} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.subtitle}>Enter your email and we'll send you a reset code.</Text>
              <Input
                label="Email"
                placeholder="you@example.com"
                value={vm.email}
                onChangeText={vm.setEmail}
                keyboardType="email-address"
                autoComplete="email"
              />
              {vm.error && <Text style={styles.error}>{vm.error}</Text>}
              <View style={styles.btnWrap}>
                <PrimaryBtn label="Send reset code" full onPress={vm.handleSubmit} loading={vm.loading} />
              </View>
            </>
          )}
          <View style={styles.footer}>
            <TouchableOpacity onPress={vm.goToLogin}>
              <Text style={styles.footerLink}>Back to log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
