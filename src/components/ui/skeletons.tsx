import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { DS } from '../../constants/ds';

// Bordered card list with an avatar + two text lines per row.
// Matches the organisations and content list layouts.
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <View style={styles.card}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={[styles.row, i < rows - 1 && styles.rowBorder]}>
          <Skeleton width={36} height={36} radius={8} />
          <View style={styles.rowText}>
            <Skeleton width="55%" height={13} />
            <Skeleton width="35%" height={11} />
          </View>
        </View>
      ))}
    </View>
  );
}

// Simple name-only rows (categories).
export function SimpleListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <View style={styles.stack}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.simpleCard}>
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton width="45%" height={13} />
            <Skeleton width="70%" height={11} />
          </View>
          <Skeleton width={30} height={30} radius={6} />
        </View>
      ))}
    </View>
  );
}

// Wrapped chip placeholders (tags).
export function ChipSkeleton({ chips = 8 }: { chips?: number }) {
  const widths = [60, 84, 48, 72, 56, 90, 50, 66, 78, 54];
  return (
    <View style={styles.chipWrap}>
      {Array.from({ length: chips }).map((_, i) => (
        <Skeleton key={i} width={widths[i % widths.length]} height={36} radius={8} />
      ))}
    </View>
  );
}

// Stacked card placeholders (API keys).
export function CardListSkeleton({ rows = 3, height = 86 }: { rows?: number; height?: number }) {
  return (
    <View style={styles.stack}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={height} radius={10} />
      ))}
    </View>
  );
}

// Stacked form fields (account / security / settings).
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <View style={styles.form}>
      {Array.from({ length: fields }).map((_, i) => (
        <View key={i} style={{ gap: 8 }}>
          <Skeleton width="30%" height={11} />
          <Skeleton height={40} radius={8} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: DS.bg,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
  },
  rowText: { flex: 1, gap: 8 },

  stack: { padding: 12, gap: 10 },
  simpleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: DS.bg,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 8,
    padding: 14,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
  },

  form: { padding: 20, gap: 18 },
});
