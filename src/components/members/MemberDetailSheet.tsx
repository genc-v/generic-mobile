import { View, Text, Modal, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrgMemberWithProfile } from '../../types/org-members.types';
import { ORG_ROLES } from '../../viewmodels/useOrgMembers';
import { Avatar } from './Avatar';
import { rolePalette } from './roleColors';
import { styles } from '../../styles/app/org-members.styles';
import { DS } from '../../constants/ds';

type Props = {
  member: OrgMemberWithProfile;
  roleUpdating: boolean;
  removingId: string | null;
  onRoleChange: (role: string) => void;
  onRemove: () => void;
  onClose: () => void;
};

export function MemberDetailSheet({ member, roleUpdating, removingId, onRoleChange, onRemove, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const name = member.profile?.displayName ?? 'Unknown user';
  const bio = member.profile?.bio;
  const removing = removingId === member.userId;

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheetWrapper}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.handle} />
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Avatar avatarUrl={member.profile?.avatarUrl} displayName={member.profile?.displayName} size={68} />
              <Text style={[styles.sheetTitle, { marginTop: 12, textAlign: 'center' }]}>{name}</Text>
              {bio ? (
                <Text style={[styles.sheetSubtitle, { textAlign: 'center', marginTop: 4, marginBottom: 0 }]}>{bio}</Text>
              ) : null}
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>PERMISSION</Text>
            <View style={styles.chipsRow}>
              {ORG_ROLES.map(role => {
                const active = member.role === role;
                const rp = rolePalette(role);
                return (
                  <TouchableOpacity
                    key={role}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => !roleUpdating && onRoleChange(role)}
                    activeOpacity={0.7}
                    disabled={roleUpdating}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{role}</Text>
                    {active && roleUpdating && (
                      <ActivityIndicator size="small" color={DS.text1} style={{ marginLeft: 4 }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.deleteBtn} onPress={onRemove} disabled={removing} activeOpacity={0.8}>
              {removing
                ? <ActivityIndicator size="small" color={DS.red} />
                : <Text style={styles.deleteBtnLabel}>Remove from organisation</Text>}
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
