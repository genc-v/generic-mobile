import {
  View, Text, TouchableOpacity, FlatList,
  Modal, Pressable, KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../../components/layout/top-bar';
import { Input } from '../../../../components/ui/input';
import { PrimaryBtn } from '../../../../components/ui/button';
import { ListSkeleton } from '../../../../components/ui/skeletons';
import { Chevron } from '../../../../components/profile/ManageIcons';
import { useManageRoles } from '../../../../viewmodels/useManageRoles';
import { Role } from '../../../../types/user-management.types';
import { DS } from '../../../../constants/ds';
import { styles } from '../../../../styles/app/profile/manage-users.styles';

function RoleRow({ role, onPress }: { role: Role; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowAvatar}>
        <Text style={styles.rowAvatarText}>{(role.name?.[0] ?? '?').toUpperCase()}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>{role.name}</Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {role.description || 'No description'}
        </Text>
      </View>
      <Chevron />
    </TouchableOpacity>
  );
}

export default function ManageRolesScreen() {
  const vm = useManageRoles();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Roles" />

      {vm.loading ? (
        <ListSkeleton rows={6} />
      ) : vm.error ? (
        <View style={styles.empty}>
          <Text style={styles.errorText}>{vm.error}</Text>
          <TouchableOpacity onPress={vm.refresh}><Text style={[styles.emptyHint, { color: DS.accent }]}>Tap to retry</Text></TouchableOpacity>
        </View>
      ) : vm.roles.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No roles yet</Text>
          <Text style={styles.emptyHint}>Create one with the button below.</Text>
        </View>
      ) : (
        <FlatList
          data={vm.roles}
          keyExtractor={r => r.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <RoleRow role={item} onPress={() => vm.openEdit(item)} />}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={vm.openCreate} activeOpacity={0.85}>
        <Text style={styles.fabLabel}>+ New Role</Text>
      </TouchableOpacity>

      <Modal visible={vm.sheetOpen} transparent animationType="slide" onRequestClose={vm.closeSheet} statusBarTranslucent>
        <Pressable style={styles.overlay} onPress={vm.closeSheet}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheetWrapper}>
            <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24, maxHeight: '88%' }]}>
              <View style={styles.handle} />
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text style={styles.sheetTitle}>{vm.editing ? 'Edit Role' : 'New Role'}</Text>
                <Text style={styles.sheetSubtitle}>
                  {vm.editing ? 'Update the role name or description.' : 'Roles can be assigned to users to grant access.'}
                </Text>

                <Input label="Name" placeholder="e.g. editor" value={vm.name} onChangeText={vm.setName} />
                <Input label="Description" placeholder="What this role is for" value={vm.description} onChangeText={vm.setDescription} />
                <PrimaryBtn label={vm.editing ? 'Save Changes' : 'Create Role'} full onPress={vm.save} loading={vm.saving} />

                {vm.editing && (
                  <>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.deleteBtn} onPress={vm.remove} disabled={vm.deleting} activeOpacity={0.7}>
                      {vm.deleting ? <ActivityIndicator color={DS.red} /> : <Text style={styles.deleteBtnLabel}>Delete Role</Text>}
                    </TouchableOpacity>
                  </>
                )}

              </ScrollView>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
