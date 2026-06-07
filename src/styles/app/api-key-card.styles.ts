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
  retryLabel: { fontSize: 13, color: DS.text2, textDecorationLine: 'underline', marginTop: 4 },

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
});
