import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../../components/layout/top-bar';
import { styles } from '../../../../styles/app/org-settings.styles';

export default function UsersScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Users" />
      <View style={styles.placeholder}>
        <Text style={styles.placeholderTitle}>Members</Text>
        <Text style={styles.placeholderHint}>Coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}
