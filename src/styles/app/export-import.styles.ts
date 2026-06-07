import { StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.bg },
  scroll: { padding: 16, paddingBottom: 48 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: DS.text3,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 8,
  },

  card: {
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  cardLeft: { flex: 1, gap: 2 },

  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.text1,
    letterSpacing: -0.15,
  },

  cardSub: {
    fontSize: 12,
    color: DS.text3,
  },

  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: DS.border2,
    backgroundColor: DS.surface3,
  },

  exportBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: DS.text1,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: DS.border,
  },

  statusSuccess: {
    fontSize: 12,
    color: DS.green,
    fontWeight: '500',
  },

  statusError: {
    fontSize: 12,
    color: DS.red,
  },

  divider: {
    height: 1,
    backgroundColor: DS.border,
    marginVertical: 16,
  },

  importCard: {
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 10,
    padding: 16,
    gap: 12,
  },

  importTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.text1,
    letterSpacing: -0.15,
  },

  importHint: {
    fontSize: 12,
    color: DS.text3,
    lineHeight: 18,
  },

  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DS.border2,
    borderStyle: 'dashed',
    backgroundColor: DS.bg,
  },

  pickBtnText: {
    fontSize: 13,
    color: DS.text2,
    flex: 1,
  },

  fileName: {
    fontSize: 13,
    color: DS.accent,
    fontWeight: '500',
    flex: 1,
  },

  clearBtn: {
    padding: 4,
  },

  clearBtnText: {
    fontSize: 13,
    color: DS.text3,
  },

  importActionRow: {
    flexDirection: 'row',
    gap: 8,
  },

  importSubmitBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DS.accent,
  },

  importSubmitBtnDisabled: {
    opacity: 0.45,
  },

  importSubmitText: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.bg,
    letterSpacing: -0.1,
  },

  resultBox: {
    backgroundColor: DS.bg,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },

  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  resultLabel: {
    fontSize: 12,
    color: DS.text3,
  },

  resultValueGreen: {
    fontSize: 13,
    fontWeight: '600',
    color: DS.green,
  },

  resultValueAmber: {
    fontSize: 13,
    fontWeight: '600',
    color: DS.amber,
  },

  errorList: {
    marginTop: 8,
    gap: 4,
  },

  errorItem: {
    fontSize: 12,
    color: DS.red,
    lineHeight: 16,
  },

  importErrorText: {
    fontSize: 13,
    color: DS.red,
    fontWeight: '500',
  },

  formatRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: DS.border,
    backgroundColor: DS.surface2,
  },

  chipActive: {
    backgroundColor: DS.surface3,
    borderColor: DS.border2,
  },

  chipText: {
    fontSize: 13,
    color: DS.text3,
    fontWeight: '500',
  },

  chipTextActive: {
    color: DS.text1,
  },
});
