import { StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

export const styles = StyleSheet.create({
  scroll: { padding: 12, paddingBottom: 120 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: DS.bg,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  chipLabel: { fontSize: 13, color: DS.text1 },
  chipEditDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: DS.text4 },

  centred: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 60 },
  emptyText: { fontSize: 15, color: DS.text2, fontWeight: '500' },
  emptyHint: { fontSize: 13, color: DS.text3 },
  errorText: { fontSize: 14, color: DS.red, textAlign: 'center' },
  retryBtn: { marginTop: 4 },
  retryLabel: { fontSize: 13, color: DS.text2, textDecorationLine: 'underline' },

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
  fabLabel: { fontSize: 13, fontWeight: '500', color: '#0A0A0A' },
  fabPlus: { fontSize: 16, fontWeight: '400', color: '#0A0A0A', lineHeight: 18 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
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
  sheetTitle: { fontSize: 17, fontWeight: '700', color: DS.text1, letterSpacing: -0.4, marginBottom: 20 },

  deleteBtn: {
    marginTop: 12,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBtnLabel: { fontSize: 14, color: DS.red },
  error: { fontSize: 13, color: DS.red, fontWeight: '500', marginBottom: 12 },
});
