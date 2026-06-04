import Svg, { Path, Circle } from 'react-native-svg';
import { DS } from '../../constants/ds';

// Line icons for the admin Manage Users area, drawn in the same stroke style
// as the content/media icons used elsewhere in the app.

export function UsersIcon({ size = 20, color = DS.accent }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx={8} cy={7} r={3.2} stroke={color} strokeWidth={1.3} />
      <Path d="M2.5 18.5c0-3 2.4-5 5.5-5s5.5 2 5.5 5" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M15 4.4a3.2 3.2 0 0 1 0 6.1" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M16.5 13.7c2.1.5 3.5 2.2 3.5 4.8" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  );
}

export function ShieldIcon({ size = 20, color = DS.accent }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M11 2l7 2.8v5.4c0 4.6-3 7.8-7 9.3-4-1.5-7-4.7-7-9.3V4.8L11 2Z" stroke={color} strokeWidth={1.3} strokeLinejoin="round" />
      <Path d="M8 11l2.2 2.2L14.5 9" stroke={color} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Chevron({ size = 14, color = DS.text3 }: { size?: number; color?: string }) {
  return (
    <Svg width={(size / 14) * 9} height={size} viewBox="0 0 9 14" fill="none">
      <Path d="M1.5 1L7.5 7L1.5 13" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
