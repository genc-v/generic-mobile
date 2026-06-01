import { StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.bg,
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: DS.text1,
    marginTop: 24,
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 14,
    color: DS.text2,
    marginTop: 6,
    marginBottom: 36,
    letterSpacing: -0.15,
    lineHeight: 20,
  },
  otpWrap: {
    marginBottom: 32,
  },
  error: {
    fontSize: 13,
    color: DS.red,
    fontWeight: '500',
    marginBottom: 12,
  },
  backWrap: {
    alignItems: 'center',
    marginTop: 18,
  },
  back: {
    fontSize: 13,
    color: DS.text1,
    textDecorationLine: 'underline',
    letterSpacing: -0.15,
  },
});
