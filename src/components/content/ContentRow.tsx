import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ContentDTO } from '../../types/content.types';
import { StatusPill, STATUS_COLOR } from './StatusPill';
import { DS } from '../../constants/ds';

type Props = {
  entry: ContentDTO;
  last: boolean;
  onPress: () => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
}

export function ContentRow({ entry, last, onPress }: Props) {
  const status = entry.status ?? 'New';
  const color = STATUS_COLOR[status] ?? DS.text3;
  const tags = entry.tags ?? [];

  return (
    <TouchableOpacity
      style={[styles.row, !last && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.top}>
        <Text style={[styles.title, !entry.title && styles.titleUntitled]}>
          {entry.title || 'Untitled'}
        </Text>
        <Text style={styles.date}>{formatDate(entry.updatedOn)}</Text>
      </View>
      <View style={styles.meta}>
        <StatusPill label={status} color={color} />
        {entry.categoryName && (
          <>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{entry.categoryName}</Text>
          </>
        )}
        {tags.length > 0 && (
          <>
            <View style={styles.dot} />
            <Text style={styles.metaText}>
              {tags.slice(0, 2).map(t => t.name).join(', ')}
              {tags.length > 2 ? ` +${tags.length - 2}` : ''}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 13,
    paddingHorizontal: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: DS.text1,
    letterSpacing: -0.15,
    marginRight: 8,
  },
  titleUntitled: {
    color: DS.text3,
  },
  date: {
    fontSize: 11,
    color: DS.text4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: DS.text4,
  },
  metaText: {
    fontSize: 11,
    color: DS.text3,
  },
});
