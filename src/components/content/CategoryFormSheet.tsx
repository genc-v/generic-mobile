import {
  View, Text, Modal, Pressable, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryBtn } from '../ui/button';
import { Input } from '../ui/input';
import { useCategoryForm } from '../../viewmodels/useCategoryForm';
import { CategoryDetail } from '../../types/content.types';
import { styles } from '../../styles/app/categories.styles';
import { DS } from '../../constants/ds';

type Props = {
  visible: boolean;
  orgId: string;
  editing: CategoryDetail | null;
  loadingDetail: boolean;
  onSaved: (isNew: boolean, result: CategoryDetail) => void;
  onDeleted: (categoryId: string) => void;
  onClose: () => void;
};

export function CategoryFormSheet({ visible, orgId, editing, loadingDetail, onSaved, onDeleted, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useCategoryForm({ visible, orgId, editing, onSaved, onDeleted });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ justifyContent: 'flex-end' }}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>{vm.isNew ? 'New Category' : 'Edit Category'}</Text>

            {loadingDetail ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={DS.accent} />
              </View>
            ) : (
              <>
                <Input
                  label="Name"
                  placeholder="Category name"
                  value={vm.name}
                  onChangeText={vm.setName}
                />

                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={styles.descBox}
                  value={vm.description}
                  onChangeText={vm.setDescription}
                  placeholder="Optional description"
                  placeholderTextColor={DS.text4}
                  multiline
                  textAlignVertical="top"
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
                      : <Text style={styles.deleteBtnLabel}>Delete Category</Text>
                    }
                  </TouchableOpacity>
                )}
              </>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
