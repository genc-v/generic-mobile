import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, FlatList,
  ActivityIndicator, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../components/layout/top-bar';
import { SearchBar } from '../../../components/content/SearchBar';
import { ContentRow } from '../../../components/content/ContentRow';
import { BottomTabBar, ContentTab } from '../../../components/content/BottomTabBar';
import { ApiKeyCard } from '../../../components/keys/ApiKeyCard';
import { GenerateKeySheet } from '../../../components/keys/GenerateKeySheet';
import { RevealKeySheet } from '../../../components/keys/RevealKeySheet';
import { PrimaryBtn, GhostBtn } from '../../../components/ui/button';
import { useContentList, StatusFilter } from '../../../viewmodels/useContentList';
import { useApiKeys } from '../../../viewmodels/useApiKeys';
import { useOrgSettings } from '../../../viewmodels/useOrgSettings';
import { styles } from '../../../styles/app/content-list.styles';
import { styles as keyStyles } from '../../../styles/app/api-keys.styles';
import { styles as settingsStyles } from '../../../styles/app/org-settings.styles';
import { DS } from '../../../constants/ds';

const FILTERS: StatusFilter[] = ['All', 'New', 'Draft', 'Published', 'Unpublished'];

export default function OrgDashboard() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const vm = useContentList(orgId);
  const keysVm = useApiKeys(orgId);
  const settingsVm = useOrgSettings(orgId);
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ContentTab>('Content');

  const { canManageOrg, canEdit } = settingsVm;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />

      <TopBar title={activeTab} />

      {activeTab === 'Content' && (
        <>
          <SearchBar
            placeholder={`Search ${vm.totalCount} entries…`}
            value={vm.search}
            onChangeText={vm.setSearch}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
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
              <TouchableOpacity style={styles.retryBtn} onPress={vm.fetchEntries}>
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
            <FlatList
              data={vm.entries}
              keyExtractor={item => item.contentId}
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={<View style={styles.list} />}
              renderItem={({ item, index }) => (
                <ContentRow
                  entry={item}
                  last={index === vm.entries.length - 1}
                  onPress={() => vm.handleOpenEntry(item.contentId)}
                />
              )}
              CellRendererComponent={({ children, index, style, ...rest }) => (
                <View
                  {...rest}
                  style={[
                    style,
                    {
                      marginHorizontal: 16,
                      backgroundColor: DS.bg,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      borderColor: DS.border,
                      ...(index === 0 ? { borderTopWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8 } : {}),
                      ...(index === vm.entries.length - 1 ? { borderBottomWidth: 1, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 } : {}),
                    },
                  ]}
                >
                  {children}
                </View>
              )}
            />
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

      {activeTab !== 'Content' && activeTab !== 'Keys' && activeTab !== 'Settings' && (
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
