import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Role } from '../../types/user-management.types';
import { styles } from '../../styles/app/profile/manage-users.styles';
import { DS } from '../../constants/ds';

type Props = {
  role: Role;
  on: boolean;
  pending: boolean;
  onPress: () => void;
};

export function RoleChip({ role, on, pending, onPress }: Props) {
  return (
    <TouchableOpacity style={[styles.chip, on && styles.chipOn]} onPress={onPress} activeOpacity={0.7} disabled={pending}>
      {pending
        ? <ActivityIndicator size="small" color={DS.accent} style={styles.chipSpinner} />
        : <Text style={[styles.chipText, on && styles.chipTextOn]}>{on ? '✓ ' : '+ '}{role.name}</Text>}
    </TouchableOpacity>
  );
}
