import { StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.bg },

  // A horizontal ScrollView grows to fill remaining vertical space unless
  // constrained — flexGrow:0 keeps the filter row at its natural chip height.
  filterScroll: {
    flexGrow: 0,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 2,
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: DS.border,
  },
  filterChipActive: {
    backgroundColor: DS.surface3,
    borderColor: DS.border2,
  },
  filterChipLabel: {
    fontSize: 12,
    color: DS.text3,
    letterSpacing: -0.1,
  },
  filterChipLabelActive: {
    color: DS.text1,
    fontWeight: '500',
  },

  list: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: DS.bg,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },

  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 60,
  },
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
  fabLabel: { fontSize: 13, fontWeight: '500', color: '#0A0A0A', letterSpacing: -0.1 },
  fabPlus: { fontSize: 16, fontWeight: '400', color: '#0A0A0A', lineHeight: 18 },

  scroll: { paddingBottom: 120 },
  scrollEmpty: { flexGrow: 1 },
});
