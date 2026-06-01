import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../components/layout/top-bar';
import { Input } from '../../../components/ui/input';
import { PrimaryBtn } from '../../../components/ui/button';
import { FormSkeleton } from '../../../components/ui/skeletons';
import { useAccountSettings } from '../../../viewmodels/useAccountSettings';
import { styles } from '../../../styles/app/profile/account.styles';

export default function AccountSettingsScreen() {
  const vm = useAccountSettings();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Account Settings" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {vm.fetching ? (
          <FormSkeleton fields={6} />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Input label="Display name" placeholder="How you appear to others" value={vm.displayName} onChangeText={vm.setDisplayName} />
            <Input label="First name" placeholder="First name" value={vm.firstName} onChangeText={vm.setFirstName} />
            <Input label="Last name" placeholder="Last name" value={vm.lastName} onChangeText={vm.setLastName} />
            <Input label="Bio" placeholder="A short bio" value={vm.bio} onChangeText={vm.setBio} />
            <Input label="Phone number" placeholder="+1 555 000 0000" value={vm.phoneNumber} onChangeText={vm.setPhoneNumber} />
            <Input label="Timezone" placeholder="e.g. Europe/London" value={vm.timezone} onChangeText={vm.setTimezone} />
            {vm.error && <Text style={styles.error}>{vm.error}</Text>}
            {vm.success && <Text style={styles.successMsg}>Changes saved.</Text>}
            <View style={styles.btnWrap}>
              <PrimaryBtn label="Save Changes" full onPress={vm.handleSave} loading={vm.saving} />
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
