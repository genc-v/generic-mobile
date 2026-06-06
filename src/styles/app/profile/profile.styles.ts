import { StyleSheet } from 'react-native';
import { DS } from '../../../constants/ds';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.bg,
  },
  scroll: {
    paddingBottom: 40,
  },
  avatarWrap: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: DS.surface3,
    borderWidth: 2,
    borderColor: DS.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: DS.text1,
  },
  info: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 28,
    gap: 6,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '700',
    color: DS.text1,
  },
  bio: {
    fontSize: 13,
    color: DS.text2,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 260,
  },
  navSection: {
    marginHorizontal: 16,
    gap: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: DS.bg,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 8,
    padding: 16,
  },
  navRowDestructive: {
    backgroundColor: 'rgba(239,68,68,0.06)',
    borderColor: 'rgba(239,68,68,0.2)',
  },
  navIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: DS.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconDestructive: {
    backgroundColor: 'rgba(239,68,68,0.12)',
  },
  navEmoji: {
    fontSize: 16,
  },
  navLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: DS.text1,
  },
  navLabelDestructive: {
    color: DS.red,
  },
  chevron: {
    width: 6,
    height: 10,
    justifyContent: 'center',
  },
  chevL1: {
    position: 'absolute',
    width: 1.3,
    height: 6,
    backgroundColor: DS.text3,
    borderRadius: 1,
    right: 0,
    top: 0,
    transform: [{ rotate: '45deg' }, { translateY: 1 }],
  },
  chevL2: {
    position: 'absolute',
    width: 1.3,
    height: 6,
    backgroundColor: DS.text3,
    borderRadius: 1,
    right: 0,
    bottom: 0,
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
});
