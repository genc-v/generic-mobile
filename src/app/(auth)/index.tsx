import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Brand } from '../../components/ui/brand';
import { PrimaryBtn, GhostBtn } from '../../components/ui/button';
import { useSplash } from '../../viewmodels/useSplash';
import { styles } from '../../styles/auth/splash.styles';

export default function Splash() {
  const vm = useSplash();

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
          <PrimaryBtn label="Log in" full onPress={vm.goToLogin} />
          <View style={styles.gap} />
          <GhostBtn label="Create account" full onPress={vm.goToRegister} />
          <Text style={styles.version}>v0.1.0 · generic.io</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
