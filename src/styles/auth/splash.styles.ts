import { StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 56,
    paddingBottom: 56,
    justifyContent: 'space-between',
  },
  top: {},
  headline: {
    fontSize: 38,
    fontWeight: '600',
    color: DS.text1,
    letterSpacing: -1.5,
    marginTop: 140,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 15,
    color: DS.text2,
    marginTop: 18,
    lineHeight: 22,
    letterSpacing: -0.15,
    maxWidth: 280,
  },
  bottom: {
    width: '100%',
  },
  gap: {
    height: 10,
  },
  version: {
    fontSize: 10,
    color: DS.text4,
    textAlign: 'center',
    marginTop: 14,
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
});
