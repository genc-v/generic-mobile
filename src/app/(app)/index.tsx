import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Brand } from '../../components/ui/brand';
import { OrgRow } from '../../components/organisations/OrgRow';
import { CreateOrgSheet } from '../../components/organisations/CreateOrgSheet';
import { useOrganisations } from '../../viewmodels/useOrganisations';
import { styles } from '../../styles/app/organisations.styles';
import { DS } from '../../constants/ds';

export default function OrganisationsScreen() {
  const vm = useOrganisations();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Brand size={26} />
          <Text style={styles.headerTitle}>Generic</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={vm.goToProfile}>
          <Text style={styles.avatarText}>ME</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>Organisations</Text>
        {!vm.loading && (
          <Text style={styles.pageSubtitle}>
            {vm.totalCount} {vm.totalCount === 1 ? 'org' : 'orgs'}
          </Text>
        )}
      </View>

      <FlatList
        data={vm.orgs}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.scroll, vm.orgs.length === 0 && styles.scrollEmpty]}
        showsVerticalScrollIndicator={false}
        onEndReached={vm.handleEndReached}
        onEndReachedThreshold={0.3}
        onRefresh={vm.handleRefresh}
        refreshing={vm.loading}
        ListHeaderComponent={vm.orgs.length > 0 ? <View style={styles.listCard} /> : null}
        ListEmptyComponent={
          vm.loading ? null : vm.error ? (
            <View style={styles.centred}>
              <Text style={styles.errorText}>{vm.error}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={vm.handleRefresh}>
                <Text style={styles.retryLabel}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.centred}>
              <Text style={styles.emptyText}>No organisations yet.</Text>
              <Text style={styles.emptyHint}>Tap + New org to create one.</Text>
            </View>
          )
        }
        ListFooterComponent={
          vm.loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator color={DS.accent} size="small" />
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <OrgRow
            org={item}
            onPress={() => vm.goToOrg(item.id)}
            last={index === vm.orgs.length - 1 && !vm.hasMore.current}
          />
        )}
        CellRendererComponent={({ children, index, style, ...rest }) => (
          <View
            {...rest}
            style={[
              style,
              index === 0 && styles.cardFirst,
              index === vm.orgs.length - 1 && styles.cardLast,
              styles.cardCell,
            ]}
          >
            {children}
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => vm.setShowCreate(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabPlus}>+</Text>
        <Text style={styles.fabLabel}>New org</Text>
      </TouchableOpacity>

      <CreateOrgSheet
        visible={vm.showCreate}
        onClose={() => vm.setShowCreate(false)}
        onCreated={vm.handleOrgCreated}
      />
    </SafeAreaView>
  );
}
