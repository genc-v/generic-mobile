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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
  },
  backL1: { position: 'absolute', width: 1.4, height: 7, backgroundColor: DS.text2, borderRadius: 1, left: 8, top: 3, transform: [{ rotate: '-45deg' }] },
  backL2: { position: 'absolute', width: 1.4, height: 7, backgroundColor: DS.text2, borderRadius: 1, left: 8, bottom: 3, transform: [{ rotate: '45deg' }] },
  headerMeta: { gap: 2 },
  headerTitle: { fontSize: 14, fontWeight: '600', color: DS.text1, letterSpacing: -0.3 },
  headerId: { fontSize: 10, color: DS.text4 },

  scroll: { paddingBottom: 120 },

  titleSection: { padding: 20, paddingBottom: 0 },
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    color: DS.text1,
    letterSpacing: -0.6,
    padding: 0,
    marginBottom: 14,
  },
  divider: { height: 1, backgroundColor: DS.border, marginBottom: 18 },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  toolbarBtn: {
    fontSize: 14,
    color: DS.text3,
    fontWeight: '400',
  },
  toolbarSep: {
    width: 1,
    height: 16,
    backgroundColor: DS.border,
  },

  contentInput: {
    paddingHorizontal: 20,
    fontSize: 14,
    color: DS.text2,
    lineHeight: 24,
    letterSpacing: -0.15,
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 0,
  },

  properties: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: DS.text3,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  propRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
  },
  propLabel: { fontSize: 13, color: DS.text3, letterSpacing: -0.1 },
  propValue: { fontSize: 13, color: DS.text1, letterSpacing: -0.1 },

  tagsSection: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 5,
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border2,
  },
  tagLabel: { fontSize: 12, color: DS.text1, letterSpacing: -0.1 },

  feedback: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  errorText: { fontSize: 13, color: DS.red, fontWeight: '500' },
  successText: { fontSize: 13, color: '#22C55E', fontWeight: '500' },

  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(9,9,11,0.92)',
    borderTopWidth: 1,
    borderTopColor: DS.border,
    padding: 12,
  },
});
