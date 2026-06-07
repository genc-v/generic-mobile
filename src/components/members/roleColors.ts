import { DS } from '../../constants/ds';

export const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Admin: { bg: 'rgba(255,255,255,0.08)', text: DS.text1, border: DS.border2 },
  Editor: { bg: DS.surface3, text: DS.text1, border: DS.border },
  Viewer: { bg: 'transparent', text: DS.text3, border: DS.border },
};

export function rolePalette(role: string) {
  return ROLE_COLORS[role] ?? ROLE_COLORS.Viewer;
}
