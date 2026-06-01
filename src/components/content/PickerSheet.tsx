import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, Modal, Pressable, ScrollView, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { SearchBar } from './SearchBar';
import { styles } from '../../styles/app/picker.styles';
import { DS } from '../../constants/ds';

export type PickerItem = { id: string; name: string };

type Props = {
  visible: boolean;
  title: string;
  placeholder: string;
  multi: boolean;
  selectedIds: string[];
  onSearch: (query: string) => Promise<PickerItem[]>;
  onSelect: (item: PickerItem) => void;
  onClose: () => void;
};

export function PickerSheet({ visible, title, placeholder, multi, selectedIds, onSearch, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    setLoading(true);
    try {
      setItems(await onSearch(q));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [onSearch]);

  useEffect(() => {
    if (visible) {
      setSearch('');
      runSearch('');
    }
  }, [visible, runSearch]);

  function handleSearchChange(text: string) {
    setSearch(text);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => runSearch(text), 300);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ justifyContent: 'flex-end' }}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.handle} />
            <Text style={styles.title}>{title}</Text>

            <View style={styles.searchWrap}>
              <SearchBar placeholder={placeholder} value={search} onChangeText={handleSearchChange} />
            </View>

            {loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={DS.accent} />
              </View>
            ) : items.length === 0 ? (
              <View style={styles.loadingWrap}>
                <Text style={styles.emptyText}>No matches.</Text>
              </View>
            ) : (
              <ScrollView style={styles.list} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {items.map(item => {
                  const selected = selectedIds.includes(item.id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.row}
                      onPress={() => onSelect(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.rowLabel}>{item.name}</Text>
                      {selected && (
                        <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                          <Path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke={DS.accent} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {multi && (
              <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.8}>
                <Text style={styles.doneLabel}>Done</Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
