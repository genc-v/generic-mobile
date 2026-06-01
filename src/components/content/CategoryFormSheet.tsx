import { useState, useEffect } from 'react';
import {
  View, Text, Modal, Pressable, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryBtn } from '../ui/button';
import { Input } from '../ui/input';
import { contentService } from '../../services/content.service';
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
  const isNew = editing === null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setName(editing?.name ?? '');
      setDescription(editing?.description ?? '');
      setError(null);
    }
  }, [visible, editing]);

  async function handleSave() {
    if (!name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const result = await contentService.createCategory(orgId, name.trim(), description.trim() || undefined);
        onSaved(true, result);
      } else {
        await contentService.updateCategory(orgId, {
          categoryId: editing!.categoryId,
          name: name.trim(),
          description: description.trim() || undefined,
        });
        onSaved(false, { ...editing!, name: name.trim(), description: description.trim() || null });
      }
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editing) return;
    setDeleting(true);
    try {
      await contentService.deleteCategory(orgId, editing.categoryId);
      onDeleted(editing.categoryId);
    } catch {
      setError('Failed to delete. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ justifyContent: 'flex-end' }}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>{isNew ? 'New Category' : 'Edit Category'}</Text>

            {loadingDetail ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={DS.accent} />
              </View>
            ) : (
              <>
                <Input
                  label="Name"
                  placeholder="Category name"
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={styles.descBox}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Optional description"
                  placeholderTextColor={DS.text4}
                  multiline
                  textAlignVertical="top"
                />

                {error && <Text style={styles.error}>{error}</Text>}

                <PrimaryBtn label="Save" full onPress={handleSave} loading={saving} />

                {!isNew && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={handleDelete}
                    disabled={deleting}
                    activeOpacity={0.7}
                  >
                    {deleting
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
