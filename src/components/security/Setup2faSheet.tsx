import { View, Text, Modal, Pressable, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSetup2fa } from '../../viewmodels/useSetup2fa';
import { OtpInput } from '../ui/otp-input';
import { PrimaryBtn } from '../ui/button';
import { styles } from '../../styles/app/profile/security.styles';
import { DS } from '../../constants/ds';

type Props = {
  visible: boolean;
  onClose: () => void;
  onEnabled: () => void;
};

export function Setup2faSheet({ visible, onClose, onEnabled }: Props) {
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
              <View style={styles.qrPlaceholder}><ActivityIndicator color={DS.text3} /></View>
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
