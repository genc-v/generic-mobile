import {
  View, Text, TouchableOpacity, ScrollView,
  Modal, Pressable, KeyboardAvoidingView, Platform,
  Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../components/layout/top-bar';
import { OtpInput } from '../../../components/ui/otp-input';
import { PrimaryBtn, GhostBtn } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useSecurity } from '../../../viewmodels/useSecurity';
import { useSetup2fa } from '../../../viewmodels/useSetup2fa';
import { useDisable2fa } from '../../../viewmodels/useDisable2fa';
import { styles } from '../../../styles/app/profile/security.styles';

function SetupSheet({ visible, onClose, onEnabled }: {
  visible: boolean; onClose: () => void; onEnabled: () => void;
}) {
  const insets = useSafeAreaInsets();
  const vm = useSetup2fa(visible, onEnabled);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheetWrapper}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Enable 2FA</Text>
            <Text style={styles.sheetSubtitle}>Scan this QR code with Google Authenticator or any TOTP app.</Text>

            {vm.step === 'loading' && (
              <View style={styles.qrPlaceholder}><ActivityIndicator color="#A78BFA" /></View>
            )}
            {vm.step === 'error' && (
              <View style={styles.qrPlaceholder}><Text style={styles.errorText}>Failed to load setup data.</Text></View>
            )}
            {vm.step === 'qr' && (
              <>
                <View style={styles.qrWrap}>
                  <Image source={{ uri: vm.qrUri }} style={styles.qrImage} resizeMode="contain" />
                </View>
                <TouchableOpacity style={styles.manualKeyRow} onPress={vm.handleCopy} activeOpacity={0.7}>
                  <Text style={styles.manualKey} numberOfLines={2}>{vm.formattedKey}</Text>
                  <View style={[styles.copyBtn, vm.copied && styles.copyBtnDone]}>
                    <Text style={[styles.copyBtnLabel, vm.copied && styles.copyBtnLabelDone]}>
                      {vm.copied ? 'Copied!' : 'Copy'}
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.codeLabel}>Verification Code</Text>
                <OtpInput value={vm.code} onChange={vm.setCode} focused={vm.otpFocused} onFocusChange={vm.setOtpFocused} digitHeight={56} />
                {vm.error && <Text style={styles.errorText}>{vm.error}</Text>}
                <View style={{ marginTop: 20 }}>
                  <PrimaryBtn label="Confirm & Enable" full onPress={vm.handleConfirm} loading={vm.confirming} />
                </View>
              </>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function DisableSheet({ visible, onClose, onDisabled }: {
  visible: boolean; onClose: () => void; onDisabled: () => void;
}) {
  const insets = useSafeAreaInsets();
  const vm = useDisable2fa(onDisabled, onClose);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={vm.handleClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={vm.handleClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheetWrapper}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Disable 2FA</Text>
            <Text style={styles.sheetSubtitle}>Enter your current 6-digit authenticator code to confirm.</Text>
            <Text style={styles.codeLabel}>Verification Code</Text>
            <OtpInput value={vm.code} onChange={vm.setCode} focused={vm.focused} onFocusChange={vm.setFocused} digitHeight={56} />
            {vm.error && <Text style={styles.errorText}>{vm.error}</Text>}
            <View style={[styles.sheetActions, { marginTop: 20 }]}>
              <View style={{ flex: 1 }}><GhostBtn label="Cancel" full onPress={vm.handleClose} /></View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 1 }}><PrimaryBtn label="Disable" full onPress={vm.handleDisable} loading={vm.loading} /></View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

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
              <ActivityIndicator color="#A78BFA" style={{ paddingVertical: 12 }} />
            ) : (
              <>
                <Input label="Email" placeholder="you@example.com" value={vm.email} onChangeText={vm.setEmail} keyboardType="email-address" />
                <Input label="Username" placeholder="username" value={vm.username} onChangeText={vm.setUsername} />
                <View style={styles.divider} />
                <Input label="Current password" placeholder="Required to save changes" value={vm.currentPassword} onChangeText={vm.setCurrentPassword} secureTextEntry />
                <Input label="New password" placeholder="Leave blank to keep current" value={vm.newPassword} onChangeText={vm.setNewPassword} secureTextEntry />
                {vm.saveError && <Text style={styles.errorText}>{vm.saveError}</Text>}
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

      <SetupSheet visible={vm.showSetup} onClose={() => vm.setShowSetup(false)} onEnabled={vm.handleEnabled} />
      <DisableSheet visible={vm.showDisable} onClose={() => vm.setShowDisable(false)} onDisabled={vm.handleDisabled} />
    </SafeAreaView>
  );
}
