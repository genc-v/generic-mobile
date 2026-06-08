import { View, Text, TouchableOpacity } from 'react-native';
import { ManagedUser } from '../../types/user-management.types';
import { styles } from '../../styles/app/profile/manage-users.styles';

function initials(u: ManagedUser) {
  return (u.username?.[0] ?? u.email?.[0] ?? '?').toUpperCase();
}

type Props = {
  user: ManagedUser;
  selectMode: boolean;
  selected: boolean;
  onPress: () => void;
};

export function UserRow({ user, selectMode, selected, onPress }: Props) {
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
