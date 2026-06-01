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
    padding: 24,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: DS.border2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: DS.text1,
    letterSpacing: -0.4,
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
    color: DS.text1,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  input: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DS.border2,
    backgroundColor: DS.surface2,
    paddingHorizontal: 12,
    fontSize: 14,
    color: DS.text1,
    letterSpacing: -0.1,
    marginBottom: 16,
  },

  error: {
    fontSize: 13,
    color: DS.red,
    fontWeight: '500',
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: DS.border,
    marginVertical: 20,
  },

  deleteBtn: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: DS.red,
  },
  confirmRow: {
    gap: 8,
  },
  confirmText: {
    fontSize: 12,
    color: DS.text3,
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 10,
  },

  gearBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
