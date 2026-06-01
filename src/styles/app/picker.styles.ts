import { StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: DS.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: DS.border2,
    paddingTop: 12,
    maxHeight: '80%',
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: DS.border2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 17, fontWeight: '700', color: DS.text1, letterSpacing: -0.4, paddingHorizontal: 24, marginBottom: 12 },

  searchWrap: { marginBottom: 8, marginHorizontal: -16 },

  loadingWrap: { paddingVertical: 32, alignItems: 'center' },
  emptyText: { fontSize: 13, color: DS.text3 },

  list: { paddingHorizontal: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
  },
  rowLabel: { fontSize: 14, color: DS.text1, letterSpacing: -0.1 },

  doneBtn: {
    marginHorizontal: 24,
    marginTop: 16,
    height: 44,
    borderRadius: 8,
    backgroundColor: DS.text1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneLabel: { fontSize: 14, fontWeight: '500', color: '#0A0A0A' },
});
