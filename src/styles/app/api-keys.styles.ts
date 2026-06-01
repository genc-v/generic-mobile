import { StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

export const styles = StyleSheet.create({
  scroll: { padding: 12, paddingBottom: 120 },

  card: {
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },

  keyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  keyText: {
    flex: 1,
    fontSize: 12,
    color: DS.text1,
    letterSpacing: 0.3,
  },
  copyIconBtn: {
    padding: 4,
  },

  toggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  divider: {
    height: 1,
    backgroundColor: DS.border,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  metaDot: {
    fontSize: 10,
    color: DS.text4,
  },
  metaText: {
    fontSize: 11,
    color: DS.text3,
  },
  metaSpacer: { flex: 1 },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 5,
    borderWidth: 1,
  },
  badgeDot: { width: 4, height: 4, borderRadius: 2 },
  badgeLabel: { fontSize: 10, fontWeight: '600' },

  deleteBtn: { padding: 4, marginLeft: 4 },

  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 60,
  },
  emptyText: { fontSize: 15, color: DS.text2, fontWeight: '500' },
  emptyHint: { fontSize: 13, color: DS.text3 },
  errorText: { fontSize: 13, color: DS.red },

  fab: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: DS.text1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  fabLabel: { fontSize: 13, fontWeight: '500', color: '#0A0A0A', letterSpacing: -0.1 },
  fabPlus: { fontSize: 16, fontWeight: '400', color: '#0A0A0A', lineHeight: 18 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetWrapper: { justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: DS.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: DS.border2,
    padding: 24,
    paddingTop: 12,
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: DS.border2, alignSelf: 'center', marginBottom: 24 },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: DS.text1, letterSpacing: -0.4, marginBottom: 6 },
  sheetSubtitle: { fontSize: 13, color: DS.text2, marginBottom: 20, letterSpacing: -0.15 },

  expiryRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  expiryChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: DS.border,
    alignItems: 'center',
  },
  expiryChipActive: { backgroundColor: DS.accentDim, borderColor: DS.accentBorder },
  expiryChipLabel: { fontSize: 12, color: DS.text3 },
  expiryChipLabelActive: { color: DS.accent, fontWeight: '600' },

  warning: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(234,179,8,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.27)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  warningText: { flex: 1, fontSize: 12, color: DS.amber, lineHeight: 18 },

  keyBox: {
    backgroundColor: DS.surface2,
    borderWidth: 1.5,
    borderColor: DS.accentBorder,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  keyBoxLabel: { fontSize: 9, color: DS.text3, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  keyBoxValue: { fontSize: 11, color: DS.text1, lineHeight: 18, marginBottom: 10 },
  copyBtn: { alignSelf: 'flex-end' },
  copyBtnLabel: { fontSize: 12, fontWeight: '600', color: DS.accent },
  copyBtnLabelDone: { color: '#22C55E' },

  generateError: { fontSize: 13, color: DS.red, fontWeight: '500', marginBottom: 12 },
});
