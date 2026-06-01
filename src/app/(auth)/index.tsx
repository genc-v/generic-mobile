import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Brand } from '../../components/ui/brand';
import { PrimaryBtn, GhostBtn } from '../../components/ui/button';
import { DS } from '../../constants/ds';

export default function Splash() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.top}>
          <Brand size={36} />
          <Text style={styles.headline}>Your content,{'\n'}your control.</Text>
          <Text style={styles.subtitle}>A headless CMS for teams that ship.</Text>
        </View>
        <View style={styles.bottom}>
          <PrimaryBtn label="Log in" full onPress={() => router.push('/(auth)/login')} />
          <View style={styles.gap} />
          <GhostBtn label="Create account" full onPress={() => router.push('/(auth)/register')} />
          <Text style={styles.version}>v0.1.0 · generic.io</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
