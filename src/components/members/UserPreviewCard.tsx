import { View, Text } from 'react-native';
import { UserPublicProfile } from '../../types/org-members.types';
import { Avatar } from './Avatar';
import { styles } from '../../styles/app/org-members.styles';

type Props = { profile: UserPublicProfile };

export function UserPreviewCard({ profile }: Props) {
  const name = profile.displayName ?? 'No display name set';
  return (
    <View style={styles.previewCard}>
      <Avatar avatarUrl={profile.avatarUrl} displayName={profile.displayName} size={42} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowName} numberOfLines={1}>{name}</Text>
        {profile.bio ? <Text style={styles.rowSub} numberOfLines={2}>{profile.bio}</Text> : null}
      </View>
    </View>
  );
}
