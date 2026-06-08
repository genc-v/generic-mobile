import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../components/layout/top-bar';
import { Input } from '../../../components/ui/input';
import { PrimaryBtn } from '../../../components/ui/button';
import { FormSkeleton } from '../../../components/ui/skeletons';
import { useAccountSettings } from '../../../viewmodels/useAccountSettings';
import { styles } from '../../../styles/app/profile/account.styles';
import { DS } from '../../../constants/ds';

export default function AccountSettingsScreen() {
  const vm = useAccountSettings();
  const initials = (vm.displayName || vm.firstName || '?').slice(0, 1).toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Account Settings" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {vm.fetching ? (
          <FormSkeleton fields={6} />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.avatarSection}>
              <TouchableOpacity style={styles.avatarTouchable} onPress={vm.handlePickAvatar} activeOpacity={0.8} disabled={vm.uploading}>
                <View style={styles.avatarWrap}>
                  {vm.uploading ? (
                    <ActivityIndicator color={DS.text2} />
                  ) : vm.avatarUrl ? (
                    <Image source={{ uri: vm.avatarUrl }} style={styles.avatarImage} contentFit="cover" />
                  ) : (
                    <Text style={styles.avatarInitials}>{initials}</Text>
                  )}
                </View>
                {!vm.uploading && (
                  <View style={styles.avatarEditBtn}>
                    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                      <Path d="M8 1.5L10.5 4 3.5 11H1V8.5L8 1.5Z" stroke={DS.text2} strokeWidth={1.2} strokeLinejoin="round" />
                    </Svg>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.avatarHint}>Tap to change profile photo</Text>
            </View>

            <Input label="Display name" placeholder="How you appear to others" value={vm.displayName} onChangeText={vm.setDisplayName} />
            <Input label="First name" placeholder="First name" value={vm.firstName} onChangeText={vm.setFirstName} />
            <Input label="Last name" placeholder="Last name" value={vm.lastName} onChangeText={vm.setLastName} />
            <Input label="Bio" placeholder="A short bio" value={vm.bio} onChangeText={vm.setBio} />
            <Input label="Phone number" placeholder="+1 555 000 0000" value={vm.phoneNumber} onChangeText={vm.setPhoneNumber} />
            <Input label="Timezone" placeholder="e.g. Europe/London" value={vm.timezone} onChangeText={vm.setTimezone} />
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
