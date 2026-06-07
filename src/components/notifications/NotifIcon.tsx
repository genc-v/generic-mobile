import Svg, { Path, Circle } from 'react-native-svg';
import { NotifIconKind } from '../../utils/notifications';

type Props = { kind: NotifIconKind; color: string };

export function NotifIcon({ kind, color }: Props) {
  const p = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' };
  switch (kind) {
    case 'asset':
      return <Svg {...p}><Path d="M3 12.5h10M8 2.5v8M5 7.5L8 10.5l3-3" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'user':
      return <Svg {...p}><Circle cx={8} cy={5.5} r={2.5} stroke={color} strokeWidth={1.4} /><Path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke={color} strokeWidth={1.4} strokeLinecap="round" /></Svg>;
    case 'key':
      return <Svg {...p}><Circle cx={6} cy={7} r={3} stroke={color} strokeWidth={1.4} /><Path d="M9 7h4.5M11.5 7v2" stroke={color} strokeWidth={1.4} strokeLinecap="round" /></Svg>;
    case 'edit':
      return <Svg {...p}><Path d="M10 2.5L13.5 6 5.5 14H2V10.5L10 2.5Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" /></Svg>;
    case 'delete':
      return <Svg {...p}><Path d="M2.5 4.5h11M6 4.5V3h4v1.5M12.5 4.5l-.7 9H4.2l-.7-9" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'bell':
    default:
      return <Svg {...p}><Path d="M8 1.5A4.5 4.5 0 0 0 3.5 6v3.5L2 11h12l-1.5-1.5V6A4.5 4.5 0 0 0 8 1.5Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" /><Path d="M6.5 11.5a1.5 1.5 0 0 0 3 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" /></Svg>;
  }
}
