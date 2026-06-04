import { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { StatusPill, STATUS_COLOR } from '../../../../components/content/StatusPill';
import { PickerSheet } from '../../../../components/content/PickerSheet';
import { EntryPreviewModal } from '../../../../components/content/EntryPreviewModal';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { PrimaryBtn, GhostBtn } from '../../../../components/ui/button';
import { useEntryEditor } from '../../../../viewmodels/useEntryEditor';
import { styles } from '../../../../styles/app/entry-editor.styles';
import { DS } from '../../../../constants/ds';

type ToolAction =
  | { kind: 'wrap'; prefix: string; suffix?: string }
  | { kind: 'line'; marker: string }
  | { kind: 'insert'; snippet: string; cursorOffset?: number }
  | { kind: 'sep' };

const TOOLS: { label: string; bold?: boolean; italic?: boolean; underline?: boolean; action: ToolAction }[] = [
  { label: 'B', bold: true, action: { kind: 'wrap', prefix: '**' } },
  { label: 'I', italic: true, action: { kind: 'wrap', prefix: '_' } },
  { label: 'S', action: { kind: 'wrap', prefix: '~~' } },
  { label: '', action: { kind: 'sep' } },
  { label: 'H1', action: { kind: 'line', marker: '# ' } },
  { label: 'H2', action: { kind: 'line', marker: '## ' } },
  { label: '“ ”', action: { kind: 'line', marker: '> ' } },
  { label: '•', action: { kind: 'line', marker: '- ' } },
  { label: '1.', action: { kind: 'line', marker: '1. ' } },
  { label: '', action: { kind: 'sep' } },
  { label: '< >', action: { kind: 'wrap', prefix: '`' } },
  { label: '🔗', action: { kind: 'insert', snippet: '[text](url)', cursorOffset: 1 } },
];

function EntryEditorSkeleton() {
  return (
    <View>
      <Skeleton height={220} radius={0} />
      <View style={{ padding: 20, gap: 16 }}>
        <Skeleton width="65%" height={24} />
        <View style={{ height: 1, backgroundColor: DS.border }} />
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[32, 32, 32, 40, 40].map((w, i) => <Skeleton key={i} width={w} height={32} radius={6} />)}
        </View>
        <Skeleton width="100%" height={14} />
        <Skeleton width="92%" height={14} />
        <Skeleton width="78%" height={14} />
        <Skeleton width="40%" height={11} style={{ marginTop: 12 }} />
        <Skeleton height={44} radius={8} />
        <Skeleton height={44} radius={8} />
      </View>
    </View>
  );
}

export default function EntryEditor() {
  const { orgId, entryId } = useLocalSearchParams<{ orgId: string; entryId: string }>();
  const vm = useEntryEditor(orgId, entryId);
  const insets = useSafeAreaInsets();
  const [showPreview, setShowPreview] = useState(false);

  const status = vm.entry?.status ?? 'New';
  const statusColor = STATUS_COLOR[status] ?? DS.text3;

  function runTool(action: ToolAction) {
    if (action.kind === 'wrap') vm.wrapSelection(action.prefix, action.suffix);
    else if (action.kind === 'line') vm.prefixLine(action.marker);
    else if (action.kind === 'insert') vm.insertAtCursor(action.snippet, action.cursorOffset);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={vm.goBack} hitSlop={12}>
            <Svg width={10} height={16} viewBox="0 0 9 14" fill="none">
              <Path d="M7.5 1L1.5 7L7.5 13" stroke={DS.text2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit entry</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.previewBtn}
            onPress={() => setShowPreview(true)}
            disabled={vm.loading}
            hitSlop={10}
            activeOpacity={0.7}
          >
            <Svg width={17} height={17} viewBox="0 0 18 18" fill="none">
              <Path d="M1 9s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z" stroke={DS.text2} strokeWidth={1.4} strokeLinejoin="round" />
              <Path d="M9 11.2A2.2 2.2 0 1 0 9 6.8a2.2 2.2 0 0 0 0 4.4Z" stroke={DS.text2} strokeWidth={1.4} />
            </Svg>
            <Text style={styles.previewLabel}>Preview</Text>
          </TouchableOpacity>
          {vm.autosaving && (
            <Text style={{ color: DS.text3, fontSize: 11, fontWeight: '500', marginRight: 2 }}>Saving…</Text>
          )}
          <StatusPill label={status} color={statusColor} />
        </View>
      </View>

      {vm.loading ? (
        <EntryEditorSkeleton />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            {vm.assetUrl ? (
              <Image source={{ uri: vm.assetUrl }} style={styles.heroImage} resizeMode="cover" />
            ) : (
              !vm.uploading && (
                <TouchableOpacity style={styles.heroCenterBtn} onPress={vm.handlePickAsset} activeOpacity={0.85}>
                  <Svg width={15} height={15} viewBox="0 0 16 16" fill="none">
                    <Path d="M8 10.5V3M4.5 6.5L8 3l3.5 3.5M3 12.5h10" stroke="#0A0A0A" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={styles.heroCenterBtnText}>Upload image</Text>
                </TouchableOpacity>
              )
            )}

            {vm.assetUrl && !vm.uploading && (
              <View style={styles.heroButtons}>
                <TouchableOpacity style={styles.heroBtn} onPress={vm.handlePickAsset} activeOpacity={0.8}>
                  <Text style={styles.heroBtnText}>Replace</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.heroBtn, styles.heroBtnDanger]} onPress={vm.clearAsset} activeOpacity={0.8}>
                  <Text style={styles.heroBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {vm.uploading && (
              <View style={styles.heroUploading}>
                <ActivityIndicator color={DS.text1} />
                <Text style={styles.heroUploadingLabel}>Uploading…</Text>
              </View>
            )}
          </View>

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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolbar}
            keyboardShouldPersistTaps="handled"
          >
            {TOOLS.map((tool, i) =>
              tool.action.kind === 'sep' ? (
                <View key={`sep-${i}`} style={styles.toolbarSep} />
              ) : (
                <TouchableOpacity
                  key={tool.label + i}
                  style={styles.toolBtn}
                  onPress={() => runTool(tool.action)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.toolBtnText,
                    tool.bold && { fontWeight: '700' },
                    tool.italic && { fontStyle: 'italic' },
                    tool.underline && { textDecorationLine: 'underline' },
                  ]}>
                    {tool.label}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          <TextInput
            style={styles.contentInput}
            value={vm.richContent}
            onChangeText={vm.setRichContent}
            onSelectionChange={e => vm.setSelection(e.nativeEvent.selection)}
            selection={vm.selection}
            placeholder="Start writing…"
            placeholderTextColor={DS.text3}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.properties}>
            <Text style={styles.sectionLabel}>Properties</Text>

            <View style={styles.propRow}>
              <Text style={styles.propLabel}>Category</Text>
              <TouchableOpacity
                style={styles.propValueBtn}
                onPress={() => vm.setShowCategoryPicker(true)}
                activeOpacity={0.7}
              >
                {vm.categoryName ? (
                  <>
                    <Text style={styles.propValueText}>{vm.categoryName}</Text>
                    <TouchableOpacity style={styles.propClear} onPress={vm.clearCategory} hitSlop={8}>
                      <Svg width={11} height={11} viewBox="0 0 11 11" fill="none">
                        <Path d="M2 2l7 7M9 2l-7 7" stroke={DS.text3} strokeWidth={1.3} strokeLinecap="round" />
                      </Svg>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.propPlaceholder}>Select…</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.propRow}>
              <Text style={styles.propLabel}>Slug</Text>
              <Text style={[styles.propValue, { fontVariant: ['tabular-nums'] }]} numberOfLines={1}>
                {vm.entry?.slug || '—'}
              </Text>
            </View>

            <View style={styles.propRow}>
              <Text style={styles.propLabel}>Status</Text>
              <StatusPill label={status} color={statusColor} />
            </View>

            {vm.entry && (
              <View style={styles.propRow}>
                <Text style={styles.propLabel}>Updated</Text>
                <Text style={styles.propValue}>
                  {new Date(vm.entry.updatedOn).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            )}

            <View style={[styles.propRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.propLabel}>Content ID</Text>
              <Text style={[styles.propValue, { fontVariant: ['tabular-nums'] }]} numberOfLines={1}>
                {entryId}
              </Text>
            </View>
          </View>
          <View style={styles.tagsSection}>
            <Text style={styles.sectionLabel}>Tags</Text>
            <View style={styles.tagsRow}>
              {vm.tags.map(tag => (
                <View key={tag.tagId} style={styles.tag}>
                  <Text style={styles.tagLabel}>{tag.name}</Text>
                  <TouchableOpacity style={styles.tagRemove} onPress={() => vm.removeTag(tag.tagId)} hitSlop={6}>
                    <Svg width={9} height={9} viewBox="0 0 9 9" fill="none">
                      <Path d="M1.5 1.5l6 6M7.5 1.5l-6 6" stroke={DS.text3} strokeWidth={1.2} strokeLinecap="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addTagChip} onPress={() => vm.setShowTagPicker(true)} activeOpacity={0.7}>
                <Text style={styles.addTagLabel}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dangerSection}>
            {vm.isPublished && (
              <TouchableOpacity
                style={styles.unpublishBtn}
                onPress={vm.handleUnpublish}
                disabled={vm.unpublishing}
                activeOpacity={0.7}
              >
                {vm.unpublishing
                  ? <ActivityIndicator size="small" color={DS.text1} />
                  : <Text style={styles.unpublishLabel}>Unpublish</Text>
                }
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.deleteBtn} onPress={vm.handleDelete} disabled={vm.deleting} activeOpacity={0.7}>
              {vm.deleting
                ? <ActivityIndicator color={DS.red} />
                : <Text style={styles.deleteLabel}>Delete Entry</Text>}
            </TouchableOpacity>
          </View>

          {(vm.error || vm.saveSuccess) && (
            <View style={styles.feedback}>
              {vm.error && <Text style={styles.errorText}>{vm.error}</Text>}
              {vm.saveSuccess && <Text style={styles.successText}>Saved.</Text>}
            </View>
          )}
        </ScrollView>
      )}

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 12 }]}>
        {!vm.canPublish && !vm.loading && (
          <Text style={styles.publishHint}>
            Add {vm.missingForPublish.join(', ')} to publish
          </Text>
        )}
        <View style={styles.actionButtons}>
          <View style={{ flex: 1 }}>
            <GhostBtn label="Save draft" full onPress={vm.handleSaveDraft} loading={vm.saving} />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryBtn
              label="Publish"
              full
              onPress={vm.handlePublish}
              loading={vm.saving}
              disabled={!vm.canPublish}
            />
          </View>
        </View>
      </View>

      <EntryPreviewModal
        visible={showPreview}
        onClose={() => setShowPreview(false)}
        title={vm.title}
        richContent={vm.richContent}
        status={status}
        categoryName={vm.categoryName}
        assetUrl={vm.assetUrl}
        tags={vm.tags}
        updatedOn={vm.entry?.updatedOn}
      />

      <PickerSheet
        visible={vm.showCategoryPicker}
        title="Select Category"
        placeholder="Search categories…"
        multi={false}
        selectedIds={vm.categoryId ? [vm.categoryId] : []}
        onSearch={vm.searchCategories}
        onSelect={item => vm.selectCategory(item.id, item.name)}
        onClose={() => vm.setShowCategoryPicker(false)}
      />

      <PickerSheet
        visible={vm.showTagPicker}
        title="Select Tags"
        placeholder="Search tags…"
        multi
        selectedIds={vm.tags.map(t => t.tagId)}
        onSearch={vm.searchTags}
        onSelect={item => vm.toggleTag({ tagId: item.id, name: item.name })}
        onClose={() => vm.setShowTagPicker(false)}
      />
    </SafeAreaView>
  );
}
