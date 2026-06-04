import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { DS } from '../../constants/ds';

export function ImageIcon({ size = 22, color = DS.text3 }: { size?: number; color?: string }) {
  const h = (size / 22) * 20;
  return (
    <Svg width={size} height={h} viewBox="0 0 22 20" fill="none">
      <Rect x={1} y={1} width={20} height={18} rx={2} stroke={color} strokeWidth={1.1} />
      <Circle cx={7} cy={6.5} r={2} stroke={color} strokeWidth={1.1} />
      <Path d="M2 14l5-4 4 3.5 3-2.5 6 5" stroke={color} strokeWidth={1.1} strokeLinecap="round" />
    </Svg>
  );
}

export function FileIcon({ size = 16, color = DS.text3 }: { size?: number; color?: string }) {
  const h = (size / 16) * 20;
  return (
    <Svg width={size} height={h} viewBox="0 0 16 20" fill="none">
      <Path d="M9 1H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7L9 1Z" stroke={color} strokeWidth={1.1} />
      <Path d="M9 1v6h6" stroke={color} strokeWidth={1.1} strokeLinejoin="round" />
    </Svg>
  );
}

export function UploadIcon({ size = 14, color = DS.accent }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M7 1v8M3.5 5.5L7 2l3.5 3.5" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M1 10v1.5a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 13 11.5V10" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}
