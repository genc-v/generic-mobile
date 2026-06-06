import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { DS } from '../../constants/ds';

export type ContentTab = 'Content' | 'Categories' | 'Tags' | 'Media' | 'Settings';

const ALL_TABS: ContentTab[] = ['Content', 'Categories', 'Tags', 'Media', 'Settings'];

type Props = {
  active: ContentTab;
  onPress: (tab: ContentTab) => void;
  showSettings?: boolean;
};

function TabIcon({ name, color }: { name: ContentTab; color: string }) {
  const p = { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none' };
  switch (name) {
    case 'Content':
      return <Svg {...p}><Path d="M3 4h12M3 9h12M3 14h8" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'Categories':
      return <Svg {...p}><Rect x={2.5} y={2.5} width={5.5} height={5.5} rx={1} stroke={color} strokeWidth={1.4} strokeLinejoin="round" /><Rect x={10} y={2.5} width={5.5} height={5.5} rx={1} stroke={color} strokeWidth={1.4} strokeLinejoin="round" /><Rect x={2.5} y={10} width={5.5} height={5.5} rx={1} stroke={color} strokeWidth={1.4} strokeLinejoin="round" /><Rect x={10} y={10} width={5.5} height={5.5} rx={1} stroke={color} strokeWidth={1.4} strokeLinejoin="round" /></Svg>;
    case 'Tags':
      return <Svg {...p}><Path d="M9 2.5H3.5a1 1 0 0 0-1 1V9a1 1 0 0 0 .3.7l6 6a1 1 0 0 0 1.4 0l5.5-5.5a1 1 0 0 0 0-1.4l-6-6A1 1 0 0 0 9 2.5Z" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /><Circle cx={6} cy={6} r={0.8} fill={color} /></Svg>;
    case 'Media':
      return <Svg {...p}><Rect x={2} y={3.5} width={14} height={11} rx={1.4} stroke={color} strokeWidth={1.4} strokeLinejoin="round" /><Circle cx={6.5} cy={7.5} r={1.3} stroke={color} strokeWidth={1.4} /><Path d="M2.5 13l3.5-3 3 2.5 2.5-2 4 3.5" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'Settings':
      return <Svg {...p}><Circle cx={9} cy={9} r={2.5} stroke={color} strokeWidth={1.4} /><Path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M4.1 4.1l1.05 1.05M12.85 12.85l1.05 1.05M13.9 4.1l-1.05 1.05M5.15 12.85l-1.05 1.05" stroke={color} strokeWidth={1.4} strokeLinecap="round" /></Svg>;
    default:
      return null;
  }
}

export function BottomTabBar({ active, onPress, showSettings = true }: Props) {
  const insets = useSafeAreaInsets();
  const tabs = showSettings ? ALL_TABS : ALL_TABS.filter(t => t !== 'Settings');

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 8 }]}>
      {tabs.map(tab => {
        const isActive = tab === active;
        const color = isActive ? DS.text1 : DS.text4;
        return (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => onPress(tab)}
            activeOpacity={0.7}
          >
            <TabIcon name={tab} color={color} />
            <Text style={[styles.label, { color, fontWeight: isActive ? '600' : '400' }]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(9,9,11,0.92)',
    borderTopWidth: 1,
    borderTopColor: DS.border,
    paddingTop: 9,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    letterSpacing: -0.1,
  },
});
