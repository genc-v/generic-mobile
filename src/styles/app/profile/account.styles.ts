import { StyleSheet } from 'react-native';
import { DS } from '../../../constants/ds';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.bg,
  },
  scroll: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
    gap: 12,
  },
  avatarTouchable: {
    position: 'relative',
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: DS.surface3,
    borderWidth: 1.5,
    borderColor: DS.border2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarInitials: { fontSize: 26, fontWeight: '700', color: DS.text1 },
  avatarEditBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: DS.surface2,
    borderWidth: 1.5,
    borderColor: DS.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: { fontSize: 12, color: DS.text3 },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 13,
    color: DS.red,
    fontWeight: '500',
    marginBottom: 12,
  },
  successMsg: {
    fontSize: 13,
    color: '#22C55E',
    fontWeight: '500',
    marginBottom: 12,
  },
  btnWrap: {
    marginTop: 8,
  },
});
