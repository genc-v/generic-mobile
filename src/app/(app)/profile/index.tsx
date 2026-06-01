import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../components/layout/top-bar';
import { DS } from '../../../constants/ds';
import { useProfile } from '../../../viewmodels/useProfile';
import { styles } from '../../../styles/app/profile/profile.styles';

function NavRow({ label, emoji, onPress, destructive }: {
  label: string; emoji: string; onPress: () => void; destructive?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.navRow, destructive && styles.navRowDestructive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.navIcon, destructive && styles.navIconDestructive]}>
        <Text style={styles.navEmoji}>{emoji}</Text>
      </View>
      <Text style={[styles.navLabel, destructive && styles.navLabelDestructive]}>{label}</Text>
      {!destructive && (
        <View style={styles.chevron}>
          <View style={styles.chevL1} />
          <View style={styles.chevL2} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const vm = useProfile();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Profile" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            {vm.loading
              ? <ActivityIndicator color={DS.accent} />
              : <Text style={styles.avatarText}>{vm.initials()}</Text>
            }
          </View>
        </View>
        {vm.profile && (
          <View style={styles.info}>
            <Text style={styles.displayName}>{vm.displayLabel()}</Text>
            {vm.profile.bio && <Text style={styles.bio}>{vm.profile.bio}</Text>}
          </View>
        )}
        <View style={styles.navSection}>
          <NavRow label="Account Settings" emoji="⚙️" onPress={vm.goToAccount} />
          <NavRow label="Security & 2FA" emoji="🔐" onPress={vm.goToSecurity} />
          <NavRow label="Log Out" emoji="🚪" onPress={vm.handleLogout} destructive />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
