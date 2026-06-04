import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../components/layout/top-bar';
import { Skeleton } from '../../../components/ui/Skeleton';
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
          {vm.loading ? (
            <Skeleton width={80} height={80} radius={40} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{vm.initials()}</Text>
            </View>
          )}
        </View>
        {vm.loading ? (
          <View style={[styles.info, { alignItems: 'center', gap: 8 }]}>
            <Skeleton width={140} height={16} />
            <Skeleton width={200} height={12} />
          </View>
        ) : vm.profile && (
          <View style={styles.info}>
            <Text style={styles.displayName}>{vm.displayLabel()}</Text>
            {vm.profile.bio && <Text style={styles.bio}>{vm.profile.bio}</Text>}
          </View>
        )}
        <View style={styles.navSection}>
          <NavRow label="Account Settings" emoji="⚙️" onPress={vm.goToAccount} />
          <NavRow label="Notifications" emoji="🔔" onPress={vm.goToNotifications} />
          <NavRow label="Security & 2FA" emoji="🔐" onPress={vm.goToSecurity} />
          {vm.isAdmin && (
            <NavRow label="Manage Users" emoji="👥" onPress={vm.goToManageUsers} />
          )}
          <NavRow label="Log Out" emoji="🚪" onPress={vm.handleLogout} destructive />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
