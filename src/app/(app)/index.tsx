import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { DS } from '../../constants/ds';
import { authService } from '../../services/auth.service';

export default function HomeScreen() {
  const router = useRouter();

  async function handleLogout() {
    await authService.logout();
    router.replace('/(auth)');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.text}>hello</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutLabel}>Log out</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  text: {
    fontSize: 24,
    color: DS.text1,
  },
  logoutBtn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: DS.surface2,
    borderWidth: 1,
    borderColor: DS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutLabel: {
    color: DS.text2,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});
