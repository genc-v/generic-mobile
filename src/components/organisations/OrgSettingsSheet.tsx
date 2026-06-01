import { View, Text, TextInput, Modal, Pressable, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryBtn, GhostBtn } from '../ui/button';
import { useOrgSettings } from '../../viewmodels/useOrgSettings';
import { styles } from '../../styles/app/org-settings.styles';

type Props = {
  vm: ReturnType<typeof useOrgSettings>;
};

export function OrgSettingsSheet({ vm }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={vm.showSettings}
      transparent
      animationType="slide"
      onRequestClose={vm.handleClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={vm.handleClose}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Organisation Settings</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={vm.editName}
            onChangeText={vm.setEditName}
            placeholder="Organisation name"
            placeholderTextColor="#52525B"
            autoCapitalize="words"
          />

          {vm.error && <Text style={styles.error}>{vm.error}</Text>}

          <PrimaryBtn
            label="Save Changes"
            full
            onPress={vm.handleSave}
            loading={vm.saving}
          />

          <View style={styles.divider} />

          {vm.confirmDelete ? (
            <View style={styles.confirmRow}>
              <Text style={styles.confirmText}>
                This will permanently delete the organisation and all its data.
              </Text>
              <View style={styles.confirmActions}>
                <View style={{ flex: 1 }}>
                  <GhostBtn
                    label="Cancel"
                    full
                    onPress={() => vm.setConfirmDelete(false)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <PrimaryBtn
                    label="Delete"
                    full
                    onPress={vm.handleDelete}
                    loading={vm.deleting}
                  />
                </View>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={vm.handleDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteBtnLabel}>Delete Organisation</Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
