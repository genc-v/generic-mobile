import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  Modal, Pressable, KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../../components/layout/top-bar';
import { Input } from '../../../../components/ui/input';
import { PrimaryBtn } from '../../../../components/ui/button';
import { ListSkeleton, ChipSkeleton } from '../../../../components/ui/skeletons';
import { useManageUsers } from '../../../../viewmodels/useManageUsers';
import { useUserDetail } from '../../../../viewmodels/useUserDetail';
import { ManagedUser, Role } from '../../../../types/user-management.types';
import { DS } from '../../../../constants/ds';
import { styles } from '../../../../styles/app/profile/manage-users.styles';

function initials(u: ManagedUser) {
  return (u.username?.[0] ?? u.email?.[0] ?? '?').toUpperCase();
}

function UserRow({ user, selectMode, selected, onPress }: {
  user: ManagedUser; selectMode: boolean; selected: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, selected && styles.rowSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowAvatar}>
        <Text style={styles.rowAvatarText}>{initials(user)}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>{user.username}</Text>
        <Text style={styles.rowSub} numberOfLines={1}>{user.email}</Text>
      </View>
      {user.isTwoFactorEnabled && (
        <View style={styles.badge}><Text style={styles.badgeText}>2FA</Text></View>
      )}
      {selectMode && (
        <View style={[styles.checkbox, selected && styles.checkboxOn]}>
          {selected && <Text style={styles.checkboxTick}>✓</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

function RoleChip({ role, on, pending, onPress }: {
  role: Role; on: boolean; pending: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.chip, on && styles.chipOn]} onPress={onPress} activeOpacity={0.7} disabled={pending}>
      {pending
        ? <ActivityIndicator size="small" color={DS.accent} style={styles.chipSpinner} />
        : <Text style={[styles.chipText, on && styles.chipTextOn]}>{on ? '✓ ' : '+ '}{role.name}</Text>}
    </TouchableOpacity>
  );
}

function UserDetailSheet({ user, onClose, onChanged }: {
  user: ManagedUser; onClose: () => void; onChanged: () => void;
}) {
  const insets = useSafeAreaInsets();
  const vm = useUserDetail(user, onChanged, onClose);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheetWrapper}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24, maxHeight: '88%' }]}>
            <View style={styles.handle} />
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.sheetTitle}>Edit User</Text>
              <Text style={styles.sheetSubtitle} numberOfLines={1}>{user.id}</Text>

              <Input label="Username" placeholder="username" value={vm.username} onChangeText={vm.setUsername} />
              <Input label="Email" placeholder="you@example.com" value={vm.email} onChangeText={vm.setEmail} keyboardType="email-address" />
              <PrimaryBtn label="Save Changes" full onPress={vm.save} loading={vm.saving} />

              <View style={styles.divider} />

              <Text style={styles.chipsLabel}>ROLES</Text>
              {vm.loadingRoles ? (
                <ChipSkeleton chips={5} />
              ) : vm.allRoles.length === 0 ? (
                <Text style={styles.rowSub}>No roles defined yet.</Text>
              ) : (
                <View style={styles.chipsWrap}>
                  {vm.allRoles.map(role => (
                    <RoleChip
                      key={role.id}
                      role={role}
                      on={vm.hasRole(role.id)}
                      pending={vm.pendingRole === role.id}
                      onPress={() => vm.toggleRole(role)}
                    />
                  ))}
                </View>
              )}

              <View style={styles.divider} />

              <TouchableOpacity style={styles.deleteBtn} onPress={vm.remove} disabled={vm.deleting} activeOpacity={0.7}>
                {vm.deleting ? <ActivityIndicator color={DS.red} /> : <Text style={styles.deleteBtnLabel}>Delete User</Text>}
              </TouchableOpacity>

              {vm.error && <Text style={[styles.errorText, { marginTop: 12 }]}>{vm.error}</Text>}
              {vm.success && <Text style={styles.successText}>Saved.</Text>}
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

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
              <TouchableOpacity onPress={vm.refresh}><Text style={[styles.emptyHint, { color: DS.accent }]}>Tap to retry</Text></TouchableOpacity>
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No users found</Text>
              <Text style={styles.emptyHint}>{vm.search ? 'Try a different search.' : 'There are no accounts yet.'}</Text>
            </View>
          )
        }
        ListFooterComponent={
          vm.loadingMore ? (
            <View style={styles.loadingMore}><ActivityIndicator color={DS.accent} size="small" /></View>
          ) : null
        }
      />

      {/* Bulk action bar */}
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
