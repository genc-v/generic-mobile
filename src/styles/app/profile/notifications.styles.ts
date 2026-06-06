import { StyleSheet } from 'react-native';
import { DS } from '../../../constants/ds';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.bg,
  },

  toolbar: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: DS.text3,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  summaryCount: {
    fontSize: 12,
    fontWeight: '600',
    color: DS.text2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPillPrimary: {
    backgroundColor: DS.surface3,
    borderColor: DS.border2,
  },
  actionPillMuted: {
    backgroundColor: DS.surface2,
    borderColor: DS.border,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  actionPillTextPrimary: {
    color: DS.text1,
  },
  actionPillTextMuted: {
    color: DS.text2,
  },

  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 8,
  },
  skeletonWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: DS.surface2,
    borderColor: DS.border,
    overflow: 'hidden',
  },
  cardUnread: {
    backgroundColor: DS.surface3,
    borderColor: DS.border2,
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: DS.text1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 1,
  },
  iconBoxUnread: {
    backgroundColor: DS.surface2,
    borderColor: DS.border2,
  },
  iconBoxRead: {
    backgroundColor: DS.surface2,
    borderColor: DS.border,
  },
  body: {
    flex: 1,
    gap: 6,
    paddingTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  newBadge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 4,
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border2,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: DS.text1,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  timePill: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 4,
    backgroundColor: DS.surface3,
    borderWidth: 1,
    borderColor: DS.border,
  },
  timePillText: {
    fontSize: 10,
    fontWeight: '500',
    color: DS.text3,
    letterSpacing: -0.1,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  messageUnread: {
    color: DS.text1,
    fontWeight: '500',
  },
  messageRead: {
    color: DS.text2,
    fontWeight: '400',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DS.text1,
    letterSpacing: -0.3,
  },
  emptyHint: {
    fontSize: 13,
    color: DS.text3,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  statusPill: {
    marginTop: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: DS.border,
    backgroundColor: DS.surface2,
  },
  statusPillLive: {
    borderColor: 'rgba(34,197,94,0.35)',
    backgroundColor: 'rgba(34,197,94,0.08)',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '500',
    color: DS.text3,
  },
  statusPillTextLive: {
    color: DS.green,
  },
  errorText: {
    fontSize: 13,
    color: DS.red,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: DS.surface3,
    borderWidth: 1,
    borderColor: DS.border2,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: DS.text1,
  },
});
