import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { PrimaryBtn } from '../ui/button';
import { ApiKey } from '../../types/organisation.types';
import { DS } from '../../constants/ds';
import { styles } from '../../styles/app/api-key-sheet.styles';

type Props = {
  apiKey: ApiKey | null;
  copied: boolean;
  onCopy: () => void;
  onDismiss: () => void;
};

export function RevealKeySheet({ apiKey, copied, onCopy, onDismiss }: Props) {
  const insets = useSafeAreaInsets();
  const visible = apiKey !== null;

  const expiryLabel = apiKey?.expiresAt
    ? new Date(apiKey.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss} statusBarTranslucent>
      <Pressable style={styles.overlay}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>New API Key Generated</Text>
          <Text style={styles.sheetSubtitle}>
            {expiryLabel ? `Expires: ${expiryLabel}` : 'No expiry set.'}
          </Text>

          <View style={styles.warning}>
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path d="M8 1L15 14H1L8 1Z" stroke={DS.amber} strokeWidth={1.2} strokeLinejoin="round" />
              <Path d="M8 6v4" stroke={DS.amber} strokeWidth={1.3} strokeLinecap="round" />
              <Circle cx={8} cy={12} r={0.6} fill={DS.amber} />
            </Svg>
            <Text style={styles.warningText}>
              This key will not be shown again. Copy it now and store it securely.
            </Text>
          </View>

          <View style={styles.keyBox}>
            <Text style={styles.keyBoxLabel}>API Key</Text>
            <Text style={styles.keyBoxValue} selectable>
              {apiKey?.key}
            </Text>
            <TouchableOpacity style={styles.copyBtn} onPress={onCopy} activeOpacity={0.7}>
              <Text style={copied ? styles.copyBtnLabelDone : styles.copyBtnLabel}>
                {copied ? 'Copied!' : 'Copy Key'}
              </Text>
            </TouchableOpacity>
          </View>

          <PrimaryBtn label="I've copied this key" full onPress={onDismiss} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
