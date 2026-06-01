import { View, Text, TouchableOpacity } from 'react-native';
import { Organisation } from '../../types/organisation.types';
import { styles } from '../../styles/app/organisations.styles';
import { DS } from '../../constants/ds';

const ROLE_COLOR: Record<string, string> = {
  Admin: DS.accent,
  Editor: '#22C55E',
  Viewer: DS.text3,
};

function RoleTag({ role }: { role: string }) {
  const color = ROLE_COLOR[role] ?? DS.text3;
  return (
    <View style={styles.roleTag}>
      <View style={[styles.roleDot, { backgroundColor: color }]} />
      <Text style={styles.roleTagText}>{role}</Text>
    </View>
  );
}

function ChevronRight() {
  return (
    <View style={styles.chevron}>
      <View style={styles.chevronLine1} />
      <View style={styles.chevronLine2} />
    </View>
  );
}

type Props = { org: Organisation; last: boolean; onPress: () => void };

export function OrgRow({ org, last, onPress }: Props) {
  const initials = org.name.slice(0, 2).toUpperCase();
  return (
    <TouchableOpacity
      style={[styles.orgRow, !last && styles.orgRowBorder]}
      activeOpacity={0.6}
      onPress={onPress}
    >
      <View style={styles.orgAvatar}>
        <Text style={styles.orgAvatarText}>{initials}</Text>
      </View>
      <View style={styles.orgInfo}>
        <Text style={styles.orgName}>{org.name}</Text>
        <View style={styles.orgMeta}>
          {org.role && <RoleTag role={org.role} />}
          {org.memberCount !== undefined && (
            <Text style={styles.memberCount}>
              {org.memberCount} {org.memberCount === 1 ? 'member' : 'members'}
            </Text>
          )}
        </View>
      </View>
      <ChevronRight />
    </TouchableOpacity>
  );
}
