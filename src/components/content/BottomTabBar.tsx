import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { DS } from '../../constants/ds';

export type ContentTab = 'Content' | 'Categories' | 'Tags' | 'Media' | 'Members' | 'Keys';

const ALL_TABS: ContentTab[] = ['Content', 'Categories', 'Tags', 'Media', 'Members', 'Keys'];

type Props = {
  active: ContentTab;
  onPress: (tab: ContentTab) => void;
  adminView?: boolean;
};

function TabIcon({ name, color }: { name: ContentTab; color: string }) {
  const props = { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none' };
  switch (name) {
    case 'Content':
      return <Svg {...props}><Path d="M3 4h12M3 9h12M3 14h8" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'Categories':
      return <Svg {...props}><Rect x={2.5} y={2.5} width={5.5} height={5.5} rx={1} stroke={color} strokeWidth={1.4} strokeLinejoin="round" /><Rect x={10} y={2.5} width={5.5} height={5.5} rx={1} stroke={color} strokeWidth={1.4} strokeLinejoin="round" /><Rect x={2.5} y={10} width={5.5} height={5.5} rx={1} stroke={color} strokeWidth={1.4} strokeLinejoin="round" /><Rect x={10} y={10} width={5.5} height={5.5} rx={1} stroke={color} strokeWidth={1.4} strokeLinejoin="round" /></Svg>;
    case 'Tags':
      return <Svg {...props}><Path d="M9 2.5H3.5a1 1 0 0 0-1 1V9a1 1 0 0 0 .3.7l6 6a1 1 0 0 0 1.4 0l5.5-5.5a1 1 0 0 0 0-1.4l-6-6A1 1 0 0 0 9 2.5Z" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /><Circle cx={6} cy={6} r={0.8} fill={color} /></Svg>;
    case 'Media':
      return <Svg {...props}><Rect x={2} y={3.5} width={14} height={11} rx={1.4} stroke={color} strokeWidth={1.4} strokeLinejoin="round" /><Circle cx={6.5} cy={7.5} r={1.3} stroke={color} strokeWidth={1.4} /><Path d="M2.5 13l3.5-3 3 2.5 2.5-2 4 3.5" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'Members':
      return <Svg {...props}><Circle cx={7} cy={6} r={2.5} stroke={color} strokeWidth={1.4} /><Path d="M2.5 14a4.5 4.5 0 0 1 9 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" /><Circle cx={13} cy={6.5} r={1.8} stroke={color} strokeWidth={1.4} /><Path d="M11 14a3.5 3.5 0 0 1 5 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" /></Svg>;
    case 'Keys':
      return <Svg {...props}><Circle cx={6} cy={9} r={3} stroke={color} strokeWidth={1.4} /><Path d="M9 9h7M13.5 9v2.5M16 9v2.5" stroke={color} strokeWidth={1.4} strokeLinecap="round" /></Svg>;
    default:
      return null;
  }
}

export function BottomTabBar({ active, onPress, adminView = true }: Props) {
  const insets = useSafeAreaInsets();
  const tabs = adminView ? ALL_TABS : ALL_TABS.slice(0, 4);

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
