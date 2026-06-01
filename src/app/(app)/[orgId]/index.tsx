import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { useContentList, StatusFilter } from '../../../viewmodels/useContentList';
import { useOrgSettings } from '../../../viewmodels/useOrgSettings';
import { useCategoryList } from '../../../viewmodels/useCategoryList';
import { useTagList } from '../../../viewmodels/useTagList';
import { styles } from '../../../styles/app/content-list.styles';
import { styles as catStyles } from '../../../styles/app/categories.styles';
import { styles as tagStyles } from '../../../styles/app/tags.styles';
import { styles as filterStyles } from '../../../styles/app/content-filters.styles';
import { DS } from '../../../constants/ds';

const FILTERS: StatusFilter[] = ['All', 'New', 'Draft', 'Published', 'Unpublished'];

export default function OrgDashboard() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const vm = useContentList(orgId);
  const settingsVm = useOrgSettings(orgId);
  const catVm = useCategoryList(orgId);
  const tagVm = useTagList(orgId);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentTab>('Content');

  const { canEdit } = settingsVm;

  function handleTabPress(tab: ContentTab) {
    if (tab === 'Settings') {
      router.push(`/(app)/${orgId}/settings`);
    } else {
      setActiveTab(tab);
    }
  }

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

      {activeTab === 'Media' && (
        <View style={[styles.centred, styles.scrollEmpty]}>
          <Text style={styles.emptyText}>{activeTab}</Text>
          <Text style={styles.emptyHint}>Coming soon.</Text>
        </View>
      )}

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
}

