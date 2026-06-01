import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Modal, Pressable, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Path } from 'react-native-svg';
import { PrimaryBtn, GhostBtn } from '../ui/button';
import { AdvancedFilters } from '../../viewmodels/useContentList';
import { styles } from '../../styles/app/content-filters.styles';
import { DS } from '../../constants/ds';

type DateField = 'fromDate' | 'toDate';

function toISODate(d: Date): string {
  // Local YYYY-MM-DD (avoids UTC off-by-one from toISOString).
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseISODate(s: string): Date {
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date() : d;
}

type Props = {
  visible: boolean;
  value: AdvancedFilters;
  onApply: (next: AdvancedFilters) => void;
  onClear: () => void;
  onClose: () => void;
};

export function ContentFiltersSheet({ visible, value, onApply, onClear, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<AdvancedFilters>(value);
  const [activePicker, setActivePicker] = useState<DateField | null>(null);

  useEffect(() => {
    if (visible) {
      setDraft(value);
      setActivePicker(null);
    }
  }, [visible, value]);

  function set(key: keyof AdvancedFilters, v: string) {
    setDraft(prev => ({ ...prev, [key]: v }));
  }

  function handleValueChange(field: DateField, date: Date) {
    set(field, toISODate(date));
    // Android shows a one-shot dialog; close it after a selection.
    if (Platform.OS === 'android') setActivePicker(null);
  }

  function renderDateField(field: DateField, label: string) {
    const v = draft[field];
    return (
      <View style={styles.dateCol}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TouchableOpacity
          style={styles.dateField}
          onPress={() => setActivePicker(activePicker === field ? null : field)}
          activeOpacity={0.7}
        >
          <Text style={v ? styles.dateFieldText : styles.dateFieldPlaceholder}>
            {v || 'Select date'}
          </Text>
          {v ? (
            <TouchableOpacity style={styles.dateClear} onPress={() => set(field, '')} hitSlop={8}>
              <Svg width={11} height={11} viewBox="0 0 11 11" fill="none">
                <Path d="M2 2l7 7M9 2l-7 7" stroke={DS.text3} strokeWidth={1.3} strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          ) : (
            <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
              <Path d="M3 4.5h10v9H3v-9ZM3 7h10M5.5 2.5v2M10.5 2.5v2" stroke={DS.text3} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ justifyContent: 'flex-end' }}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.handle} />
            <Text style={styles.title}>Filters</Text>

            <Text style={styles.fieldLabel}>Category</Text>
            <TextInput
              style={styles.input}
              value={draft.category}
              onChangeText={t => set('category', t)}
              placeholder="Filter by category"
              placeholderTextColor={DS.text4}
              autoCapitalize="none"
            />

            <Text style={styles.fieldLabel}>Tag</Text>
            <TextInput
              style={styles.input}
              value={draft.tag}
              onChangeText={t => set('tag', t)}
              placeholder="Filter by tag"
              placeholderTextColor={DS.text4}
              autoCapitalize="none"
            />

            <View style={styles.dateRow}>
              {renderDateField('fromDate', 'From date')}
              {renderDateField('toDate', 'To date')}
            </View>

            {activePicker && (
              <DateTimePicker
                value={parseISODate(draft[activePicker])}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onValueChange={(_e, d) => handleValueChange(activePicker, d)}
                onDismiss={() => setActivePicker(null)}
              />
            )}

            <View style={styles.actions}>
              <View style={{ flex: 1 }}>
                <GhostBtn label="Clear" full onPress={onClear} />
              </View>
              <View style={{ flex: 1 }}>
                <PrimaryBtn label="Apply" full onPress={() => onApply(draft)} />
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
