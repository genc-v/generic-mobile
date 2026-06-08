import { View } from 'react-native';
import { Skeleton } from '../ui/Skeleton';
import { DS } from '../../constants/ds';

export function EntryEditorSkeleton() {
  return (
    <View>
      <Skeleton height={220} radius={0} />
      <View style={{ padding: 20, gap: 16 }}>
        <Skeleton width="65%" height={24} />
        <View style={{ height: 1, backgroundColor: DS.border }} />
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[32, 32, 32, 40, 40].map((w, i) => <Skeleton key={i} width={w} height={32} radius={6} />)}
        </View>
        <Skeleton width="100%" height={14} />
        <Skeleton width="92%" height={14} />
        <Skeleton width="78%" height={14} />
        <Skeleton width="40%" height={11} style={{ marginTop: 12 }} />
        <Skeleton height={44} radius={8} />
        <Skeleton height={44} radius={8} />
      </View>
    </View>
  );
}
