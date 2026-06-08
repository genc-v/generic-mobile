import { StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: DS.text1, letterSpacing: -0.3 },
  closeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  closeLabel: { fontSize: 14, color: DS.text1 },

  centred: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 60 },
  emptyText: { fontSize: 15, color: DS.text2, fontWeight: '500' },
  errorText: { fontSize: 14, color: DS.red, textAlign: 'center' },

  preview: {
    height: 220,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: DS.surface2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DS.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%' },
  previewName: { fontFamily: 'monospace', fontSize: 11, color: DS.text3 },

  detailBody: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
  },
  infoLabel: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: DS.text3,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: { fontSize: 13, color: DS.text1, flexShrink: 1, textAlign: 'right' },
  infoValueLink: { fontFamily: 'monospace', color: DS.accent, fontWeight: '500' },

  urlSection: { marginTop: 16 },
  urlLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: DS.text3,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  urlBox: {
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border2,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  urlText: { fontFamily: 'monospace', fontSize: 11, color: DS.text1, flexShrink: 1 },
  urlCopy: { fontSize: 12, color: DS.accent, fontWeight: '500' },
  urlCopied: { color: DS.green },

  deleteBtn: {
    marginTop: 24,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBtnLabel: { fontSize: 14, color: DS.red },

  detailError: { fontSize: 13, color: DS.red, fontWeight: '500', marginTop: 16 },
});
