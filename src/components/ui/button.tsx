import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DS } from '../../constants/ds';

type Props = {
  label: string;
  onPress?: () => void;
  full?: boolean;
  small?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

export function PrimaryBtn({ label, onPress, full, small, loading, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[styles.primary, full && styles.full, small && styles.small, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator size="small" color="#0A0A0A" />
        : <Text style={[styles.primaryLabel, small && styles.smallLabel]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

export function GhostBtn({ label, onPress, full, small, loading, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[styles.ghost, full && styles.full, small && styles.small, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading
        ? <ActivityIndicator size="small" color={DS.text1} />
        : <Text style={[styles.ghostLabel, small && styles.smallLabel]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: DS.text1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: {
    width: '100%',
  },
  small: {
    height: 32,
    paddingHorizontal: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryLabel: {
    color: '#0A0A0A',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  ghostLabel: {
    color: DS.text1,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  smallLabel: {
    fontSize: 13,
  },
});
