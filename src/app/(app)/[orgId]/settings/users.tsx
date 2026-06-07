import { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { TopBar } from '../../../../components/layout/top-bar';
import { MemberRow } from '../../../../components/members/MemberRow';
import { MemberDetailSheet } from '../../../../components/members/MemberDetailSheet';
import { AddMemberSheet } from '../../../../components/members/AddMemberSheet';
import { useOrgMembers } from '../../../../viewmodels/useOrgMembers';
import { styles } from '../../../../styles/app/org-members.styles';
import { DS } from '../../../../constants/ds';

export default function UsersScreen() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const insets = useSafeAreaInsets();
  const vm = useOrgMembers(orgId);

  useEffect(() => { vm.load(); }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Members" />

      {vm.loading ? (
        <View style={styles.centred}>
          <ActivityIndicator color={DS.text2} />
        </View>
      ) : vm.error ? (
        <View style={styles.centred}>
          <Text style={styles.errorText}>{vm.error}</Text>
          <TouchableOpacity onPress={vm.load} activeOpacity={0.7} style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 13, color: DS.text2, textDecorationLine: 'underline' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vm.members}
          keyExtractor={item => item.userId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={vm.loadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={styles.centred}>
              <Text style={styles.emptyTitle}>No members yet</Text>
              <Text style={styles.emptyHint}>Tap + Add member to invite someone.</Text>
            </View>
          }
          ListFooterComponent={
            vm.loadingMore
              ? <ActivityIndicator style={{ marginVertical: 16 }} color={DS.text3} />
              : null
          }
          renderItem={({ item }) => (
            <MemberRow item={item} onPress={() => vm.setDetailMember(item)} />
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 64 }]}
        onPress={vm.openAddSheet}
        activeOpacity={0.85}
      >
        <Text style={styles.fabPlus}>+</Text>
        <Text style={styles.fabLabel}>Add member</Text>
      </TouchableOpacity>

      {vm.detailMember && (
        <MemberDetailSheet
          member={vm.detailMember}
          roleUpdating={vm.roleUpdating}
          removingId={vm.removingId}
          onRoleChange={role => vm.updateRole(vm.detailMember!, role)}
          onRemove={() => vm.removeMember(vm.detailMember!)}
          onClose={() => vm.setDetailMember(null)}
        />
      )}

      {vm.addSheetVisible && (
        <AddMemberSheet
          email={vm.addEmail}
          onEmailChange={vm.setAddEmail}
          role={vm.addRole}
          onRoleChange={vm.setAddRole}
          searchLoading={vm.searchLoading}
          searchResult={vm.searchResult}
          searchError={vm.searchError}
          onSearch={vm.searchByEmail}
          addLoading={vm.addLoading}
          onAdd={vm.addMember}
          onClose={vm.closeAddSheet}
        />
      )}
    </SafeAreaView>
  );
}
