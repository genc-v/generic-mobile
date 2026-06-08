import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../../components/layout/top-bar';
import { ListSkeleton } from '../../../../components/ui/skeletons';
import { UserRow } from '../../../../components/admin/UserRow';
import { UserDetailSheet } from '../../../../components/admin/UserDetailSheet';
import { useManageUsers } from '../../../../viewmodels/useManageUsers';
import { styles } from '../../../../styles/app/profile/manage-users.styles';
import { DS } from '../../../../constants/ds';

export default function ManageUsersScreen() {
  const vm = useManageUsers();

  const selectToggle = (
    <TouchableOpacity onPress={vm.toggleSelectMode} hitSlop={10}>
      <Text style={{ color: DS.accent, fontSize: 14, fontWeight: '600' }}>
        {vm.selectMode ? 'Done' : 'Select'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Users" right={selectToggle} />

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username or email"
          placeholderTextColor={DS.text3}
          value={vm.search}
          onChangeText={vm.onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={vm.users}
        keyExtractor={u => u.id}
        contentContainerStyle={[styles.listContent, vm.users.length === 0 && { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
        onEndReached={vm.handleEndReached}
        onEndReachedThreshold={0.4}
        onRefresh={vm.refresh}
        refreshing={vm.loading && vm.users.length > 0}
        renderItem={({ item }) => (
          <UserRow
            user={item}
            selectMode={vm.selectMode}
            selected={vm.selected.has(item.id)}
            onPress={() => (vm.selectMode ? vm.toggleSelect(item.id) : vm.setActiveUser(item))}
          />
        )}
        ListEmptyComponent={
          vm.loading ? (
            <ListSkeleton rows={8} />
          ) : vm.error ? (
            <View style={styles.empty}>
              <Text style={styles.errorText}>{vm.error}</Text>
              <TouchableOpacity onPress={vm.refresh}>
                <Text style={[styles.emptyHint, { color: DS.accent }]}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No users found</Text>
              <Text style={styles.emptyHint}>{vm.search ? 'Try a different search.' : 'There are no accounts yet.'}</Text>
            </View>
          )
        }
        ListFooterComponent={
          vm.loadingMore
            ? <View style={styles.loadingMore}><ActivityIndicator color={DS.accent} size="small" /></View>
            : null
        }
      />

      {vm.selectMode && (
        <View style={styles.actionBar}>
          <Text style={styles.actionCount}>{vm.selected.size} selected</Text>
          <TouchableOpacity
            style={[styles.deleteBtn, { paddingHorizontal: 18 }, vm.selected.size === 0 && styles.disabled]}
            onPress={vm.bulkDelete}
            disabled={vm.selected.size === 0 || vm.deleting}
            activeOpacity={0.7}
          >
            {vm.deleting ? <ActivityIndicator color={DS.red} /> : <Text style={styles.deleteBtnLabel}>Delete Selected</Text>}
          </TouchableOpacity>
        </View>
      )}

      {vm.activeUser && (
        <UserDetailSheet
          key={vm.activeUser.id}
          user={vm.activeUser}
          onClose={() => vm.setActiveUser(null)}
          onChanged={vm.refresh}
        />
      )}
    </SafeAreaView>
  );
}
