import { StyleSheet } from 'react-native';
import { DS } from '../../../constants/ds';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.bg,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 14,
  },
  headerAction: {
    fontSize: 11,
    fontWeight: '500',
  },
  headerActionAccent: {
    color: DS.accent,
  },
  headerActionMuted: {
    color: DS.text3,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
  },
  rowUnread: {
    backgroundColor: 'rgba(139,92,246,0.04)',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconBoxUnread: {
    backgroundColor: DS.accentDim,
    borderWidth: 1,
    borderColor: DS.accentBorder,
  },
  iconBoxRead: {
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
  },
  iconText: {
    fontSize: 13,
  },
  body: {
    flex: 1,
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 3,
  },
  messageUnread: {
    color: DS.text1,
  },
  messageRead: {
    color: DS.text2,
  },
  time: {
    fontSize: 10,
    color: DS.text3,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: DS.accent,
    marginTop: 5,
    flexShrink: 0,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.text2,
  },
  emptyHint: {
    fontSize: 12,
    color: DS.text3,
    textAlign: 'center',
    lineHeight: 18,
  },
  errorText: {
    fontSize: 13,
    color: DS.red,
    textAlign: 'center',
    lineHeight: 19,
  },
});
