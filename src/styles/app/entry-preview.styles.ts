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
  headerLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: DS.text3,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  closeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  closeLabel: { fontSize: 13, fontWeight: '500', color: DS.text1, letterSpacing: -0.1 },

  scroll: { padding: 22, paddingTop: 16 },

  hero: {
    height: 180,
    borderRadius: 10,
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
    marginBottom: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: { width: '100%', height: '100%' },
  heroEmpty: { fontSize: 12, color: DS.text3 },

  title: {
    fontSize: 24,
    fontWeight: '600',
    color: DS.text1,
    letterSpacing: -0.7,
    lineHeight: 30,
    marginTop: 10,
  },
  titleEmpty: { color: DS.text3 },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 18,
  },
  metaText: { fontSize: 12, color: DS.text3 },
  metaDot: { width: 2, height: 2, borderRadius: 1, backgroundColor: DS.text4 },

  body: {
    fontSize: 14,
    color: DS.text2,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  bodyEmpty: { color: DS.text3, fontStyle: 'italic' },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 16,
  },
  tag: {
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  tagLabel: { fontSize: 11, color: DS.text2, letterSpacing: -0.1 },
});
