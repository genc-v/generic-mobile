import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryBtn } from '../ui/button';
import { ExpiryOption } from '../../viewmodels/useApiKeys';
import { styles } from '../../styles/app/api-key-sheet.styles';

const EXPIRY_OPTIONS: { label: string; value: ExpiryOption }[] = [
  { label: 'No expiry', value: 'none' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '1 year', value: '1y' },
];

type Props = {
  visible: boolean;
  expiry: ExpiryOption;
  generating: boolean;
  error: string | null;
  onExpiryChange: (v: ExpiryOption) => void;
  onGenerate: () => void;
  onClose: () => void;
};

export function GenerateKeySheet({ visible, expiry, generating, error, onExpiryChange, onGenerate, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Generate API Key</Text>
          <Text style={styles.sheetSubtitle}>Choose an expiry for this key.</Text>

          <View style={styles.expiryRow}>
            {EXPIRY_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.expiryChip, expiry === opt.value && styles.expiryChipActive]}
                onPress={() => onExpiryChange(opt.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.expiryChipLabel, expiry === opt.value && styles.expiryChipLabelActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error && <Text style={styles.generateError}>{error}</Text>}
          <PrimaryBtn label="Generate" full onPress={onGenerate} loading={generating} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
