import { StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

export const styles = StyleSheet.create({
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
