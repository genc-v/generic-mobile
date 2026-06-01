import {
  View, Text, Modal, Pressable, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryBtn } from '../ui/button';
import { Input } from '../ui/input';
import { useTagForm } from '../../viewmodels/useTagForm';
import { TagDTO } from '../../types/content.types';
import { styles } from '../../styles/app/tags.styles';
import { DS } from '../../constants/ds';

type Props = {
  visible: boolean;
  orgId: string;
  editing: TagDTO | null;
  onSaved: (isNew: boolean, tagId: string, name: string) => void;
  onDeleted: (tagId: string) => void;
  onClose: () => void;
};

export function TagFormSheet({ visible, orgId, editing, onSaved, onDeleted, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useTagForm({ visible, orgId, editing, onSaved, onDeleted });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ justifyContent: 'flex-end' }}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>{vm.isNew ? 'New Tag' : 'Edit Tag'}</Text>

            <Input
              label="Name"
              placeholder="tag-name"
              value={vm.name}
              onChangeText={vm.setName}
              autoCapitalize="none"
            />

            {vm.error && <Text style={styles.error}>{vm.error}</Text>}

            <PrimaryBtn label="Save" full onPress={vm.handleSave} loading={vm.saving} />

            {!vm.isNew && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={vm.handleDelete}
                disabled={vm.deleting}
                activeOpacity={0.7}
              >
                {vm.deleting
                  ? <ActivityIndicator size="small" color={DS.red} />
                  : <Text style={styles.deleteBtnLabel}>Delete Tag</Text>
                }
              </TouchableOpacity>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
