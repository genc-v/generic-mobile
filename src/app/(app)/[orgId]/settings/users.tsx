import { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, Modal,
  KeyboardAvoidingView, Platform, Pressable, ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';
import { TopBar } from '../../../../components/layout/top-bar';
import { Input } from '../../../../components/ui/input';
import { PrimaryBtn, GhostBtn } from '../../../../components/ui/button';
import { useOrgMembers, ORG_ROLES, OrgRole } from '../../../../viewmodels/useOrgMembers';
import { OrgMemberWithProfile, UserPublicProfile } from '../../../../types/org-members.types';
import { DS } from '../../../../constants/ds';
import { StyleSheet } from 'react-native';

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Admin: { bg: 'rgba(255,255,255,0.08)', text: DS.text1, border: DS.border2 },
  Editor: { bg: DS.surface3, text: DS.text1, border: DS.border },
  Viewer: { bg: 'transparent', text: DS.text3, border: DS.border },
};
function rolePalette(role: string) {
  return ROLE_COLORS[role] ?? ROLE_COLORS.Viewer;
}

function Avatar({ avatarUrl, displayName, size }: {
  avatarUrl?: string | null;
  displayName?: string | null;
  size: number;
}) {
  const initials = displayName?.trim().slice(0, 2).toUpperCase() ?? '?';
  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
      />
    );
  }
  return (
    <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[s.avatarText, size > 48 && { fontSize: 20 }]}>{initials}</Text>
    </View>
  );
}

function MemberRow({ item, onPress }: { item: OrgMemberWithProfile; onPress: () => void }) {
  const rp = rolePalette(item.role);
  const name = item.profile?.displayName ?? item.userId.slice(0, 8) + '…';
  return (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.7}>
      <Avatar avatarUrl={item.profile?.avatarUrl} displayName={item.profile?.displayName} size={38} />
      <View style={{ flex: 1 }}>
        <Text style={s.rowName} numberOfLines={1}>{name}</Text>
      </View>
      <View style={[s.roleBadge, { backgroundColor: rp.bg, borderColor: rp.border }]}>
        <Text style={[s.roleBadgeText, { color: rp.text }]}>{item.role}</Text>
      </View>
    </TouchableOpacity>
  );
}

function UserPreviewCard({ profile }: { profile: UserPublicProfile }) {
  const name = profile.displayName ?? 'No display name set';
  return (
    <View style={s.previewCard}>
      <Avatar avatarUrl={profile.avatarUrl} displayName={profile.displayName} size={42} />
      <View style={{ flex: 1 }}>
        <Text style={s.rowName} numberOfLines={1}>{name}</Text>
        {profile.bio ? <Text style={s.rowSub} numberOfLines={2}>{profile.bio}</Text> : null}
      </View>
    </View>
  );
}

function MemberDetailSheet({ member, roleUpdating, removingId, onRoleChange, onRemove, onClose }: {
  member: OrgMemberWithProfile;
  roleUpdating: boolean;
  removingId: string | null;
  onRoleChange: (role: string) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const name = member.profile?.displayName ?? 'Unknown user';
  const bio = member.profile?.bio;
  const removing = removingId === member.userId;

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={s.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.sheetWrapper}>
          <Pressable style={[s.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={s.handle} />
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Avatar avatarUrl={member.profile?.avatarUrl} displayName={member.profile?.displayName} size={68} />
              <Text style={[s.sheetTitle, { marginTop: 12, textAlign: 'center' }]}>{name}</Text>
              {bio ? (
                <Text style={[s.sheetSubtitle, { textAlign: 'center', marginTop: 4, marginBottom: 0 }]}>{bio}</Text>
              ) : null}
            </View>

            <View style={s.divider} />

            <Text style={s.sectionLabel}>PERMISSION</Text>
            <View style={s.chipsRow}>
              {ORG_ROLES.map(role => {
                const active = member.role === role;
                return (
                  <TouchableOpacity
                    key={role}
                    style={[s.chip, active && s.chipActive]}
                    onPress={() => !roleUpdating && onRoleChange(role)}
                    activeOpacity={0.7}
                    disabled={roleUpdating}
                  >
                    <Text style={[s.chipText, active && s.chipTextActive]}>{role}</Text>
                    {active && roleUpdating && (
                      <ActivityIndicator size="small" color={DS.text1} style={{ marginLeft: 4 }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={s.divider} />

            <TouchableOpacity
              style={s.deleteBtn}
              onPress={onRemove}
              disabled={removing}
              activeOpacity={0.8}
            >
              {removing
                ? <ActivityIndicator size="small" color={DS.red} />
                : <Text style={s.deleteBtnLabel}>Remove from organisation</Text>}
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function AddMemberSheet({
  email, onEmailChange, role, onRoleChange,
  searchLoading, searchResult, searchError, onSearch,
  addLoading, onAdd, onClose,
}: {
  email: string; onEmailChange: (v: string) => void;
  role: OrgRole; onRoleChange: (r: OrgRole) => void;
  searchLoading: boolean; searchResult: UserPublicProfile | null;
  searchError: string | null; onSearch: () => void;
  addLoading: boolean;
  onAdd: () => void; onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={s.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.sheetWrapper}>
          <Pressable style={[s.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={s.handle} />
              <Text style={s.sheetTitle}>Add member</Text>
              <Text style={s.sheetSubtitle}>Search by email to find a user.</Text>

              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 }}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Email"
                    placeholder="user@example.com"
                    value={email}
                    onChangeText={onEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={{ marginBottom: 16 }}>
                  <GhostBtn
                    label="Search"
                    onPress={onSearch}
                    loading={searchLoading}
                    disabled={!email.trim()}
                  />
                </View>
              </View>

              {searchError ? (
                <Text style={s.errorText}>{searchError}</Text>
              ) : searchResult ? (
                <>
                  <UserPreviewCard profile={searchResult} />

                  <View style={s.divider} />

                  <Text style={s.sectionLabel}>PERMISSION</Text>
                  <View style={[s.chipsRow, { marginBottom: 20 }]}>
                    {ORG_ROLES.map(r => (
                      <TouchableOpacity
                        key={r}
                        style={[s.chip, role === r && s.chipActive]}
                        onPress={() => onRoleChange(r)}
                        activeOpacity={0.7}
                      >
                        <Text style={[s.chipText, role === r && s.chipTextActive]}>{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <PrimaryBtn label="Add member" full onPress={onAdd} loading={addLoading} />
                </>
              ) : null}
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

export default function UsersScreen() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const insets = useSafeAreaInsets();
  const vm = useOrgMembers(orgId);

  useEffect(() => { vm.load(); }, []);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Members" />

      {vm.loading ? (
        <View style={s.centred}>
          <ActivityIndicator color={DS.text2} />
        </View>
      ) : vm.error ? (
        <View style={s.centred}>
          <Text style={s.errorText}>{vm.error}</Text>
          <TouchableOpacity onPress={vm.load} activeOpacity={0.7} style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 13, color: DS.text2, textDecorationLine: 'underline' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vm.members}
          keyExtractor={item => item.userId}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={vm.loadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={s.centred}>
              <Text style={s.emptyTitle}>No members yet</Text>
              <Text style={s.emptyHint}>Tap + Add member to invite someone.</Text>
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
        style={[s.fab, { bottom: insets.bottom + 64 }]}
        onPress={vm.openAddSheet}
        activeOpacity={0.85}
      >
        <Text style={s.fabPlus}>+</Text>
        <Text style={s.fabLabel}>Add member</Text>
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

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.bg },
  centred: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 60 },
  listContent: { padding: 16, paddingBottom: 120 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  rowName: { fontSize: 14, fontWeight: '500', color: DS.text1, letterSpacing: -0.15 },
  rowSub: { fontSize: 12, color: DS.text3, marginTop: 2 },

  avatar: { backgroundColor: DS.surface3, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700', color: DS.text1 },

  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleBadgeText: { fontSize: 11, fontWeight: '600' },

  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 4,
  },

  emptyTitle: { fontSize: 15, color: DS.text2, fontWeight: '500' },
  emptyHint: { fontSize: 13, color: DS.text3 },
  errorText: { fontSize: 13, color: DS.red, fontWeight: '500' },

  fab: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: DS.text1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  fabPlus: { fontSize: 16, fontWeight: '400', color: '#0A0A0A', lineHeight: 18 },
  fabLabel: { fontSize: 13, fontWeight: '500', color: '#0A0A0A', letterSpacing: -0.1 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetWrapper: { justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: DS.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: DS.border2,
    padding: 24,
    paddingTop: 12,
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: DS.border2, alignSelf: 'center', marginBottom: 24 },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: DS.text1, letterSpacing: -0.4, marginBottom: 6 },
  sheetSubtitle: { fontSize: 13, color: DS.text2, marginBottom: 20, letterSpacing: -0.15 },
  divider: { height: 1, backgroundColor: DS.border, marginVertical: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '500', color: DS.text3, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },

  chipsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: DS.border,
    backgroundColor: DS.surface2,
  },
  chipActive: { backgroundColor: DS.surface3, borderColor: DS.border2 },
  chipText: { fontSize: 13, color: DS.text2, fontWeight: '500' },
  chipTextActive: { color: DS.text1 },

  deleteBtn: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnLabel: { fontSize: 14, fontWeight: '600', color: DS.red },
});
