import { View, Text, Modal, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDisable2fa } from '../../viewmodels/useDisable2fa';
import { OtpInput } from '../ui/otp-input';
import { GhostBtn, PrimaryBtn } from '../ui/button';
import { styles } from '../../styles/app/profile/security.styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  onDisabled: () => void;
};

export function Disable2faSheet({ visible, onClose, onDisabled }: Props) {
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
