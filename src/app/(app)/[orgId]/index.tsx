import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator,
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
import { useContentList, StatusFilter } from '../../../viewmodels/useContentList';
import { useApiKeys } from '../../../viewmodels/useApiKeys';
import { styles } from '../../../styles/app/content-list.styles';
import { styles as keyStyles } from '../../../styles/app/api-keys.styles';
import { DS } from '../../../constants/ds';

const FILTERS: StatusFilter[] = ['All', 'New', 'Draft', 'Published', 'Unpublished'];

export default function OrgDashboard() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const vm = useContentList(orgId);
  const keysVm = useApiKeys(orgId);
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ContentTab>('Content');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />

      <TopBar title={activeTab} />

      {activeTab === 'Content' ? (
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
              <Text style={styles.emptyHint}>Tap + New entry to create one.</Text>
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
        </>
      ) : activeTab === 'Keys' ? (
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
      ) : (
        <View style={[styles.centred, styles.scrollEmpty]}>
          <Text style={styles.emptyText}>{activeTab}</Text>
          <Text style={styles.emptyHint}>Coming soon.</Text>
        </View>
      )}

      <BottomTabBar active={activeTab} onPress={setActiveTab} adminView />
    </SafeAreaView>
  );
}
