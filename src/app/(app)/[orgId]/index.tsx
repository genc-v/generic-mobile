import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { TopBar } from '../../../components/layout/top-bar';
import { SearchBar } from '../../../components/content/SearchBar';
import { ContentRow } from '../../../components/content/ContentRow';
import { CategoryFormSheet } from '../../../components/content/CategoryFormSheet';
import { TagFormSheet } from '../../../components/content/TagFormSheet';
import { ContentFiltersSheet } from '../../../components/content/ContentFiltersSheet';
import { BottomTabBar, ContentTab } from '../../../components/content/BottomTabBar';
import { ApiKeyCard } from '../../../components/keys/ApiKeyCard';
import { GenerateKeySheet } from '../../../components/keys/GenerateKeySheet';
import { RevealKeySheet } from '../../../components/keys/RevealKeySheet';
import { PrimaryBtn, GhostBtn } from '../../../components/ui/button';
import { useContentList, StatusFilter } from '../../../viewmodels/useContentList';
import { useApiKeys } from '../../../viewmodels/useApiKeys';
import { useOrgSettings } from '../../../viewmodels/useOrgSettings';
import { useCategoryList } from '../../../viewmodels/useCategoryList';
import { useTagList } from '../../../viewmodels/useTagList';
import { styles } from '../../../styles/app/content-list.styles';
import { styles as keyStyles } from '../../../styles/app/api-keys.styles';
import { styles as settingsStyles } from '../../../styles/app/org-settings.styles';
import { styles as catStyles } from '../../../styles/app/categories.styles';
import { styles as tagStyles } from '../../../styles/app/tags.styles';
import { styles as filterStyles } from '../../../styles/app/content-filters.styles';
import { DS } from '../../../constants/ds';

const FILTERS: StatusFilter[] = ['All', 'New', 'Draft', 'Published', 'Unpublished'];

export default function OrgDashboard() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const vm = useContentList(orgId);
  const keysVm = useApiKeys(orgId);
  const settingsVm = useOrgSettings(orgId);
  const catVm = useCategoryList(orgId);
  const tagVm = useTagList(orgId);
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ContentTab>('Content');

  const { canManageOrg, canEdit } = settingsVm;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />

      <TopBar title={activeTab} />

      {activeTab === 'Content' && (
        <>
          <View style={filterStyles.filterBtnRow}>
            <View style={{ flex: 1 }}>
              <SearchBar
                placeholder={`Search ${vm.totalCount} entries…`}
                value={vm.search}
                onChangeText={vm.setSearch}
              />
            </View>
            <TouchableOpacity
              style={[filterStyles.filterBtn, vm.advancedCount > 0 && filterStyles.filterBtnActive]}
              onPress={() => vm.setShowFilters(true)}
              activeOpacity={0.7}
            >
              <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <Path
                  d="M2 3.5h12M4 8h8M6.5 12.5h3"
                  stroke={vm.advancedCount > 0 ? DS.accent : DS.text2}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </Svg>
              {vm.advancedCount > 0 && (
                <View style={filterStyles.badge}>
                  <Text style={filterStyles.badgeText}>{vm.advancedCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterRow}
          >
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, vm.filter === f && styles.filterChipActive]}
                onPress={() => vm.setFilter(f)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipLabel, vm.filter === f && styles.filterChipLabelActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {vm.loading ? (
            <View style={[styles.centred, styles.scrollEmpty]}>
              <ActivityIndicator color={DS.accent} />
            </View>
          ) : vm.error ? (
            <View style={[styles.centred, styles.scrollEmpty]}>
              <Text style={styles.errorText}>{vm.error}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={vm.refetch}>
                <Text style={styles.retryLabel}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : vm.entries.length === 0 ? (
            <View style={[styles.centred, styles.scrollEmpty]}>
              <Text style={styles.emptyText}>No entries yet.</Text>
              <Text style={styles.emptyHint}>
                {canEdit ? 'Tap + New entry to create one.' : 'Nothing here yet.'}
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
              <View style={styles.list}>
                {vm.entries.map((item, index) => (
                  <ContentRow
                    key={item.contentId}
                    entry={item}
                    last={index === vm.entries.length - 1}
                    onPress={() => vm.handleOpenEntry(item.contentId)}
                  />
                ))}
              </View>
            </ScrollView>
          )}

          {canEdit && (
            <TouchableOpacity
              style={[styles.fab, { bottom: insets.bottom + 64 }]}
              onPress={vm.handleNewEntry}
              disabled={vm.creating}
              activeOpacity={0.85}
            >
              {vm.creating
                ? <ActivityIndicator size="small" color="#0A0A0A" />
                : <>
                  <Text style={styles.fabPlus}>+</Text>
                  <Text style={styles.fabLabel}>New entry</Text>
                </>
              }
            </TouchableOpacity>
          )}

          <ContentFiltersSheet
            visible={vm.showFilters}
            value={vm.advanced}
            onApply={vm.applyAdvanced}
            onClear={vm.clearAdvanced}
            onClose={() => vm.setShowFilters(false)}
          />
        </>
      )}

      {activeTab === 'Keys' && (
        <>
          {keysVm.loading ? (
            <View style={[keyStyles.centred, styles.scrollEmpty]}>
              <ActivityIndicator color={DS.accent} />
            </View>
          ) : keysVm.error ? (
            <View style={[keyStyles.centred, styles.scrollEmpty]}>
              <Text style={keyStyles.errorText}>{keysVm.error}</Text>
              <TouchableOpacity onPress={keysVm.fetch}>
                <Text style={{ fontSize: 13, color: DS.text2, textDecorationLine: 'underline', marginTop: 4 }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : keysVm.keys.length === 0 ? (
            <View style={[keyStyles.centred, styles.scrollEmpty]}>
              <Text style={keyStyles.emptyText}>No API keys yet.</Text>
              <Text style={keyStyles.emptyHint}>Tap + Generate Key to create one.</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={keyStyles.scroll} showsVerticalScrollIndicator={false}>
              {keysVm.keys.map(k => (
                <ApiKeyCard
                  key={k.id}
                  apiKey={k}
                  toggling={keysVm.togglingId === k.id}
                  deleting={keysVm.deletingId === k.id}
                  onToggle={() => keysVm.handleToggle(k.id)}
                  onDelete={() => keysVm.handleDelete(k.id)}
                />
              ))}
            </ScrollView>
          )}

          <TouchableOpacity
            style={[keyStyles.fab, { bottom: insets.bottom + 64 }]}
            onPress={() => keysVm.setShowGenerate(true)}
            activeOpacity={0.85}
          >
            <Text style={keyStyles.fabPlus}>+</Text>
            <Text style={keyStyles.fabLabel}>Generate Key</Text>
          </TouchableOpacity>

          <GenerateKeySheet
            visible={keysVm.showGenerate}
            expiry={keysVm.expiry}
            generating={keysVm.generating}
            error={keysVm.generateError}
            onExpiryChange={keysVm.setExpiry}
            onGenerate={keysVm.handleGenerate}
            onClose={() => keysVm.setShowGenerate(false)}
          />
          <RevealKeySheet
            apiKey={keysVm.newKey}
            copied={keysVm.copied}
            onCopy={keysVm.handleCopyKey}
            onDismiss={keysVm.dismissReveal}
          />
        </>
      )}

      {activeTab === 'Settings' && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={settingsTabStyles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={settingsTabStyles.sectionLabel}>ORGANISATION</Text>
            <View style={settingsTabStyles.card}>
              <Text style={settingsTabStyles.label}>Name</Text>
              <TextInput
                style={settingsTabStyles.input}
                value={settingsVm.editName}
                onChangeText={settingsVm.setEditName}
                placeholder="Organisation name"
                placeholderTextColor={DS.text4}
                autoCapitalize="words"
              />
              {settingsVm.error && (
                <Text style={settingsTabStyles.errorText}>{settingsVm.error}</Text>
              )}
              <PrimaryBtn
                label="Save Changes"
                full
                onPress={settingsVm.handleSave}
                loading={settingsVm.saving}
              />
            </View>

            <Text style={[settingsTabStyles.sectionLabel, { marginTop: 28 }]}>DANGER ZONE</Text>
            <View style={settingsTabStyles.card}>
              {settingsVm.confirmDelete ? (
                <>
                  <Text style={settingsTabStyles.confirmText}>
                    This will permanently delete the organisation and all its data. This cannot be undone.
                  </Text>
                  <View style={settingsTabStyles.confirmActions}>
                    <View style={{ flex: 1 }}>
                      <GhostBtn
                        label="Cancel"
                        full
                        onPress={() => settingsVm.setConfirmDelete(false)}
                      />
                    </View>
                    <View style={{ width: 10 }} />
                    <View style={{ flex: 1 }}>
                      <PrimaryBtn
                        label="Delete"
                        full
                        onPress={settingsVm.handleDelete}
                        loading={settingsVm.deleting}
                      />
                    </View>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  style={settingsTabStyles.deleteBtn}
                  onPress={settingsVm.handleDelete}
                  activeOpacity={0.7}
                >
                  <Text style={settingsTabStyles.deleteBtnLabel}>Delete Organisation</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {activeTab === 'Categories' && (
        <>
          <SearchBar
            placeholder="Search categories…"
            value={catVm.search}
            onChangeText={catVm.handleSearchChange}
          />

          {catVm.loading ? (
            <View style={[catStyles.centred, styles.scrollEmpty]}>
              <ActivityIndicator color={DS.accent} />
            </View>
          ) : catVm.error ? (
            <View style={[catStyles.centred, styles.scrollEmpty]}>
              <Text style={catStyles.errorText}>{catVm.error}</Text>
              <TouchableOpacity style={catStyles.retryBtn} onPress={() => catVm.fetchCategories()}>
                <Text style={catStyles.retryLabel}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : catVm.categories.length === 0 ? (
            <View style={[catStyles.centred, styles.scrollEmpty]}>
              <Text style={catStyles.emptyText}>No categories yet.</Text>
              {canEdit && <Text style={catStyles.emptyHint}>Tap + New Category to create one.</Text>}
            </View>
          ) : (
            <ScrollView contentContainerStyle={catStyles.scroll} showsVerticalScrollIndicator={false}>
              {catVm.categories.map(cat => (
                <View key={cat.categoryId} style={catStyles.card}>
                  <View style={catStyles.cardInfo}>
                    <Text style={catStyles.cardName}>{cat.name}</Text>
                  </View>
                  {canEdit && (
                    <TouchableOpacity
                      style={catStyles.editBtn}
                      onPress={() => catVm.openEdit(cat)}
                      activeOpacity={0.7}
                    >
                      <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                        <Path d="M8 1.5L10.5 4 3.5 11H1V8.5L8 1.5Z" stroke={DS.text3} strokeWidth={1.1} strokeLinejoin="round" />
                      </Svg>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          {canEdit && (
            <TouchableOpacity
              style={[catStyles.fab, { bottom: insets.bottom + 64 }]}
              onPress={catVm.openNew}
              activeOpacity={0.85}
            >
              <Text style={catStyles.fabPlus}>+</Text>
              <Text style={catStyles.fabLabel}>New Category</Text>
            </TouchableOpacity>
          )}

          <CategoryFormSheet
            visible={catVm.showForm}
            orgId={orgId}
            editing={catVm.editing}
            loadingDetail={catVm.loadingDetail}
            onSaved={catVm.handleSaved}
            onDeleted={catVm.handleDeleted}
            onClose={catVm.closeForm}
          />
        </>
      )}

      {activeTab === 'Tags' && (
        <>
          <SearchBar
            placeholder="Search tags…"
            value={tagVm.search}
            onChangeText={tagVm.handleSearchChange}
          />

          {tagVm.loading ? (
            <View style={[tagStyles.centred, styles.scrollEmpty]}>
              <ActivityIndicator color={DS.accent} />
            </View>
          ) : tagVm.error ? (
            <View style={[tagStyles.centred, styles.scrollEmpty]}>
              <Text style={tagStyles.errorText}>{tagVm.error}</Text>
              <TouchableOpacity style={tagStyles.retryBtn} onPress={() => tagVm.fetchTags()}>
                <Text style={tagStyles.retryLabel}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : tagVm.tags.length === 0 ? (
            <View style={[tagStyles.centred, styles.scrollEmpty]}>
              <Text style={tagStyles.emptyText}>No tags yet.</Text>
              {canEdit && <Text style={tagStyles.emptyHint}>Tap + New Tag to create one.</Text>}
            </View>
          ) : (
            <ScrollView contentContainerStyle={tagStyles.scroll} showsVerticalScrollIndicator={false}>
              <View style={tagStyles.chipWrap}>
                {tagVm.tags.map(tag => (
                  <TouchableOpacity
                    key={tag.tagId}
                    style={tagStyles.chip}
                    onPress={() => canEdit && tagVm.openEdit(tag)}
                    activeOpacity={canEdit ? 0.7 : 1}
                    disabled={!canEdit}
                  >
                    <Text style={tagStyles.chipLabel}>{tag.name}</Text>
                    {canEdit && (
                      <Svg width={10} height={10} viewBox="0 0 12 12" fill="none">
                        <Path d="M8 1.5L10.5 4 3.5 11H1V8.5L8 1.5Z" stroke={DS.text3} strokeWidth={1.1} strokeLinejoin="round" />
                      </Svg>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {canEdit && (
            <TouchableOpacity
              style={[tagStyles.fab, { bottom: insets.bottom + 64 }]}
              onPress={tagVm.openNew}
              activeOpacity={0.85}
            >
              <Text style={tagStyles.fabPlus}>+</Text>
              <Text style={tagStyles.fabLabel}>New Tag</Text>
            </TouchableOpacity>
          )}

          <TagFormSheet
            visible={tagVm.showForm}
            orgId={orgId}
            editing={tagVm.editingTag}
            onSaved={tagVm.handleSaved}
            onDeleted={tagVm.handleDeleted}
            onClose={tagVm.closeForm}
          />
        </>
      )}

      {activeTab !== 'Content' && activeTab !== 'Keys' && activeTab !== 'Settings' && activeTab !== 'Categories' && activeTab !== 'Tags' && (
        <View style={[styles.centred, styles.scrollEmpty]}>
          <Text style={styles.emptyText}>{activeTab}</Text>
          <Text style={styles.emptyHint}>Coming soon.</Text>
        </View>
      )}

      <BottomTabBar
        active={activeTab}
        onPress={setActiveTab}
        adminView={canManageOrg}
      />
    </SafeAreaView>
  );
}

import { StyleSheet } from 'react-native';

const settingsTabStyles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 120,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: DS.text3,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  card: {
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 10,
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: DS.text1,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  input: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DS.border2,
    backgroundColor: DS.bg,
    paddingHorizontal: 12,
    fontSize: 14,
    color: DS.text1,
    letterSpacing: -0.1,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: DS.red,
    fontWeight: '500',
    marginBottom: 12,
  },
  confirmText: {
    fontSize: 13,
    color: DS.text2,
    lineHeight: 19,
    marginBottom: 14,
  },
  confirmActions: {
    flexDirection: 'row',
  },
  deleteBtn: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: DS.red,
  },
});
