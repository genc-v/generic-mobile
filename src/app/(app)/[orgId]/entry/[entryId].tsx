import {
  View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StatusPill, STATUS_COLOR } from '../../../../components/content/StatusPill';
import { PrimaryBtn, GhostBtn } from '../../../../components/ui/button';
import { useEntryEditor } from '../../../../viewmodels/useEntryEditor';
import { styles } from '../../../../styles/app/entry-editor.styles';
import { DS } from '../../../../constants/ds';

export default function EntryEditor() {
  const { orgId, entryId } = useLocalSearchParams<{ orgId: string; entryId: string }>();
  const vm = useEntryEditor(orgId, entryId);
  const insets = useSafeAreaInsets();

  const status = vm.entry?.status ?? 'New';
  const statusColor = STATUS_COLOR[status] ?? DS.text3;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={vm.goBack} hitSlop={12}>
            <View style={styles.backL1} />
            <View style={styles.backL2} />
          </TouchableOpacity>
          <View style={styles.headerMeta}>
            <Text style={styles.headerTitle}>Edit entry</Text>
            <Text style={styles.headerId}>{entryId.slice(0, 8)}…</Text>
          </View>
        </View>
        <StatusPill label={status} color={statusColor} />
      </View>

      {vm.loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={DS.accent} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleSection}>
            <TextInput
              style={styles.titleInput}
              value={vm.title}
              onChangeText={vm.setTitle}
              placeholder="Untitled"
              placeholderTextColor={DS.text3}
              multiline
            />
            <View style={styles.divider} />
          </View>

          <View style={styles.toolbar}>
            <Text style={[styles.toolbarBtn, { fontWeight: '700' }]}>B</Text>
            <Text style={[styles.toolbarBtn, { fontStyle: 'italic' }]}>I</Text>
            <Text style={[styles.toolbarBtn, { textDecorationLine: 'underline' }]}>U</Text>
            <View style={styles.toolbarSep} />
          </View>

          <TextInput
            style={styles.contentInput}
            value={vm.richContent}
            onChangeText={vm.setRichContent}
            placeholder="Start writing…"
            placeholderTextColor={DS.text3}
            multiline
            textAlignVertical="top"
          />

          {vm.entry && (
            <View style={styles.properties}>
              <Text style={styles.sectionLabel}>Properties</Text>
              {[
                { label: 'Category', value: vm.entry.categoryName ?? '—' },
                { label: 'Status', value: <StatusPill label={status} color={statusColor} /> },
                { label: 'Updated', value: new Date(vm.entry.updatedOn).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
              ].map((row, i, a) => (
                <View key={i} style={[styles.propRow, i === a.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.propLabel}>{row.label}</Text>
                  {typeof row.value === 'string'
                    ? <Text style={styles.propValue}>{row.value}</Text>
                    : row.value
                  }
                </View>
              ))}
            </View>
          )}

          {vm.entry?.tags && vm.entry.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.sectionLabel}>Tags</Text>
              <View style={styles.tagsRow}>
                {vm.entry.tags.map(tag => (
                  <View key={tag.tagId} style={styles.tag}>
                    <Text style={styles.tagLabel}>{tag.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {(vm.error || vm.saveSuccess) && (
            <View style={styles.feedback}>
              {vm.error && <Text style={styles.errorText}>{vm.error}</Text>}
              {vm.saveSuccess && <Text style={styles.successText}>Saved.</Text>}
            </View>
          )}
        </ScrollView>
      )}

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <GhostBtn label="Save draft" full onPress={vm.handleSaveDraft} loading={vm.saving} />
        </View>
        <View style={{ flex: 1 }}>
          <PrimaryBtn label="Publish" full onPress={vm.handlePublish} loading={vm.saving} />
        </View>
      </View>
    </SafeAreaView>
  );
}
