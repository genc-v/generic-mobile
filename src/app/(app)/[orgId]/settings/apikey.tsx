import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../../components/layout/top-bar';
import { ApiKeysSection } from '../../../../components/keys/ApiKeysSection';
import { styles } from '../../../../styles/app/org-settings.styles';

export default function ApiKeysScreen() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="API Keys" />
      <ApiKeysSection orgId={orgId} />
    </SafeAreaView>
  );
}
