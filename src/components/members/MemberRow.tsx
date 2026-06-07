import { View, Text, TouchableOpacity } from 'react-native';
import { OrgMemberWithProfile } from '../../types/org-members.types';
import { Avatar } from './Avatar';
import { rolePalette } from './roleColors';
import { styles } from '../../styles/app/org-members.styles';

type Props = {
  item: OrgMemberWithProfile;
  onPress: () => void;
};

export function MemberRow({ item, onPress }: Props) {
  const rp = rolePalette(item.role);
  const name = item.profile?.displayName ?? item.userId.slice(0, 8) + '…';
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Avatar avatarUrl={item.profile?.avatarUrl} displayName={item.profile?.displayName} size={38} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowName} numberOfLines={1}>{name}</Text>
      </View>
      <View style={[styles.roleBadge, { backgroundColor: rp.bg, borderColor: rp.border }]}>
        <Text style={[styles.roleBadgeText, { color: rp.text }]}>{item.role}</Text>
      </View>
    </TouchableOpacity>
  );
}
