import { StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

export const styles = StyleSheet.create({
  scroll: { padding: 16, paddingTop: 12, paddingBottom: 120 },
  card: {
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumb: {
    height: 76,
    backgroundColor: DS.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: { width: '100%', height: '100%' },
  cardInfo: { paddingHorizontal: 8, paddingVertical: 7 },
  cardName: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: DS.text1,
  },
  cardDate: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: DS.text3,
    marginTop: 2,
  },

  uploadBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: DS.accentDim,
    borderWidth: 1,
    borderColor: DS.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centred: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 60 },
  emptyText: { fontSize: 15, color: DS.text2, fontWeight: '500' },
  emptyHint: { fontSize: 13, color: DS.text3 },
  errorText: { fontSize: 14, color: DS.red, textAlign: 'center' },
  retryBtn: { marginTop: 4 },
  retryLabel: { fontSize: 13, color: DS.text2, textDecorationLine: 'underline' },
});
