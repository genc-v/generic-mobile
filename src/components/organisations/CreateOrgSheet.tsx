import { View, Text, Modal, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../ui/input';
import { PrimaryBtn, GhostBtn } from '../ui/button';
import { useCreateOrg } from '../../viewmodels/useCreateOrg';
import { Organisation } from '../../types/organisation.types';
import { styles } from '../../styles/app/organisations.styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreated: (org: Organisation) => void;
};

export function CreateOrgSheet({ visible, onClose, onCreated }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useCreateOrg(onCreated, onClose);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={vm.handleClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={vm.handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.sheetWrapper}
        >
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>New organisation</Text>
            <Text style={styles.sheetSubtitle}>
              You'll be assigned as Admin automatically.
            </Text>
            <Input
              label="Organisation name"
              placeholder="e.g. My Project"
              value={vm.name}
              onChangeText={vm.setName}
            />
            <View style={styles.slugRow}>
              <Text style={styles.slugLabel}>URL slug</Text>
              <Text style={styles.slugValue}>{vm.slug || 'my-project'}</Text>
            </View>
            {vm.error && <Text style={styles.sheetError}>{vm.error}</Text>}
            <View style={styles.sheetActions}>
              <View style={{ flex: 1 }}>
                <GhostBtn label="Cancel" full onPress={vm.handleClose} />
              </View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 1 }}>
                <PrimaryBtn label="Create" full onPress={vm.handleCreate} loading={vm.loading} />
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
