import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../components/layout/top-bar';
import { Input } from '../../../components/ui/input';
import { PrimaryBtn } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Setup2faSheet } from '../../../components/security/Setup2faSheet';
import { Disable2faSheet } from '../../../components/security/Disable2faSheet';
import { useSecurity } from '../../../viewmodels/useSecurity';
import { styles } from '../../../styles/app/profile/security.styles';
import { DS } from '../../../constants/ds';

export default function SecurityScreen() {
  const vm = useSecurity();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Security & 2FA" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.card}>
            {vm.loadingAccount ? (
              <View style={{ gap: 18 }}>
                {[0, 1, 2, 3].map(i => (
                  <View key={i} style={{ gap: 8 }}>
                    <Skeleton width="30%" height={11} />
                    <Skeleton height={40} radius={8} />
                  </View>
                ))}
              </View>
            ) : (
              <>
                <Input label="Email" placeholder="you@example.com" value={vm.email} onChangeText={vm.setEmail} keyboardType="email-address" />
                <Input label="Username" placeholder="username" value={vm.username} onChangeText={vm.setUsername} />
                <View style={styles.divider} />
                <Input label="Current password" placeholder="Required to save changes" value={vm.currentPassword} onChangeText={vm.setCurrentPassword} secureTextEntry />
                <Input label="New password" placeholder="Leave blank to keep current" value={vm.newPassword} onChangeText={vm.setNewPassword} secureTextEntry />
                {vm.saveSuccess && <Text style={styles.successText}>Changes saved.</Text>}
                <PrimaryBtn label="Save Changes" full onPress={vm.handleSaveAccount} loading={vm.saving} />
              </>
            )}
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>TWO-FACTOR AUTHENTICATION</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Authenticator App</Text>
                <Text style={styles.cardSub}>TOTP — works offline</Text>
              </View>
              {!vm.loadingAccount && (
                <View style={[styles.badge, vm.twoFaEnabled ? styles.badgeEnabled : styles.badgeDisabled]}>
                  <View style={[styles.badgeDot, { backgroundColor: vm.twoFaEnabled ? '#22C55E' : '#71717A' }]} />
                  <Text style={[styles.badgeLabel, { color: vm.twoFaEnabled ? '#22C55E' : '#71717A' }]}>
                    {vm.twoFaEnabled ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {vm.twoFaEnabled
                  ? "Your account is protected with a TOTP authenticator. You'll be asked for a 6-digit code each time you log in."
                  : 'Enable two-factor authentication to protect your account with a one-time code from an authenticator app.'}
              </Text>
            </View>
            {vm.twoFaEnabled ? (
              <TouchableOpacity style={styles.disableBtn} onPress={() => vm.setShowDisable(true)} activeOpacity={0.7}>
                <Text style={styles.disableBtnLabel}>Disable Two-Factor Authentication</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.enableBtn} onPress={() => vm.setShowSetup(true)} activeOpacity={0.7}>
                <Text style={styles.enableBtnLabel}>Enable Two-Factor Authentication</Text>
              </TouchableOpacity>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <Setup2faSheet visible={vm.showSetup} onClose={() => vm.setShowSetup(false)} onEnabled={vm.handleEnabled} />
      <Disable2faSheet visible={vm.showDisable} onClose={() => vm.setShowDisable(false)} onDisabled={vm.handleDisabled} />
    </SafeAreaView>
  );
}
