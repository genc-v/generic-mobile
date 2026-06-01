import { useState, useEffect } from 'react';
import {
  View, Text, Modal, Pressable, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryBtn } from '../ui/button';
import { Input } from '../ui/input';
import { contentService } from '../../services/content.service';
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
  const isNew = editing === null;

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setName(editing?.name ?? '');
      setError(null);
    }
  }, [visible, editing]);

  async function handleSave() {
    if (!name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const result = await contentService.createTag(orgId, name.trim());
        onSaved(true, result.tagId, result.name);
      } else {
        await contentService.updateTag(orgId, { tagId: editing!.tagId, name: name.trim() });
        onSaved(false, editing!.tagId, name.trim());
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
      await contentService.deleteTag(orgId, editing.tagId);
      onDeleted(editing.tagId);
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
            <Text style={styles.sheetTitle}>{isNew ? 'New Tag' : 'Edit Tag'}</Text>

            <Input
              label="Name"
              placeholder="tag-name"
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
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
