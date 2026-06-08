import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Brand } from '../../components/ui/brand';
import { PrimaryBtn } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { OtpInput } from '../../components/ui/otp-input';
import { useResetPassword } from '../../viewmodels/useResetPassword';
import { styles } from '../../styles/auth/reset-password.styles';

export default function ResetPassword() {
  const vm = useResetPassword();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Brand size={28} />
          {vm.success ? (
            <>
              <Text style={styles.title}>Password updated</Text>
              <Text style={styles.subtitle}>Your password has been reset. You can now log in with your new password.</Text>
              <View style={styles.btnWrap}>
                <PrimaryBtn label="Log in" full onPress={vm.goToLogin} />
              </View>
            </>
          ) : vm.step === 'code' ? (
            <>
              <Text style={styles.title}>Enter reset code</Text>
              <Text style={styles.subtitle}>Enter the 6-digit code we sent to your email.</Text>
              <View style={styles.otpWrap}>
                <OtpInput
                  value={vm.code}
                  onChange={vm.handleCodeChange}
                  focused={vm.focused}
                  onFocusChange={vm.setFocused}
                />
              </View>
              {vm.error && <Text style={styles.error}>{vm.error}</Text>}
              <View style={styles.btnWrap}>
                <PrimaryBtn label="Continue" full onPress={vm.handleContinue} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>New password</Text>
              <Text style={styles.subtitle}>Choose a new password for your account.</Text>
              <Input
                label="New password"
                placeholder="••••••••"
                value={vm.newPassword}
                onChangeText={vm.setNewPassword}
                secureTextEntry
                autoComplete="new-password"
              />
              <Input
                label="Confirm password"
                placeholder="••••••••"
                value={vm.confirmPassword}
                onChangeText={vm.setConfirmPassword}
                secureTextEntry
                note={vm.passwordMismatch ? "Passwords don't match." : undefined}
                autoComplete="new-password"
              />
              {vm.error && <Text style={styles.error}>{vm.error}</Text>}
              <View style={styles.btnWrap}>
                <PrimaryBtn label="Reset password" full onPress={vm.handleReset} loading={vm.loading} />
              </View>
            </>
          )}
          {!vm.success && (
            <TouchableOpacity style={styles.backWrap} onPress={vm.goBack}>
              <Text style={styles.back}>Back</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
