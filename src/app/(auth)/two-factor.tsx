import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Brand } from '../../components/ui/brand';
import { PrimaryBtn } from '../../components/ui/button';
import { OtpInput } from '../../components/ui/otp-input';
import { useTwoFactor } from '../../viewmodels/useTwoFactor';
import { styles } from '../../styles/auth/two-factor.styles';

export default function TwoFactor() {
  const vm = useTwoFactor();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Brand size={28} />
        <Text style={styles.title}>Two-factor authentication</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code from your authenticator app.</Text>
        <View style={styles.otpWrap}>
          <OtpInput
            value={vm.code}
            onChange={vm.handleChange}
            focused={vm.focused}
            onFocusChange={vm.setFocused}
          />
        </View>
        {vm.error && <Text style={styles.error}>{vm.error}</Text>}
        <PrimaryBtn label="Verify" full onPress={vm.handleVerify} loading={vm.loading} />
        <TouchableOpacity style={styles.backWrap} onPress={vm.goToLogin}>
          <Text style={styles.back}>Back to log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
