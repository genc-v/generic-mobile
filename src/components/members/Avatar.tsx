import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { styles } from '../../styles/app/org-members.styles';

type Props = {
  avatarUrl?: string | null;
  displayName?: string | null;
  size: number;
};

export function Avatar({ avatarUrl, displayName, size }: Props) {
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
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, size > 48 && { fontSize: 20 }]}>{initials}</Text>
    </View>
  );
}
