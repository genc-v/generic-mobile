import { View, Text, Modal, Pressable, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ManagedUser } from '../../types/user-management.types';
import { useUserDetail } from '../../viewmodels/useUserDetail';
import { Input } from '../ui/input';
import { PrimaryBtn } from '../ui/button';
import { ChipSkeleton } from '../ui/skeletons';
import { RoleChip } from './RoleChip';
import { styles } from '../../styles/app/profile/manage-users.styles';
import { DS } from '../../constants/ds';

type Props = {
  user: ManagedUser;
  onClose: () => void;
  onChanged: () => void;
};

export function UserDetailSheet({ user, onClose, onChanged }: Props) {
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
