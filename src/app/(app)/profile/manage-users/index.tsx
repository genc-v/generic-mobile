import { ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { TopBar } from '../../../../components/layout/top-bar';
import { UsersIcon, ShieldIcon, Chevron } from '../../../../components/profile/ManageIcons';
import { styles } from '../../../../styles/app/profile/manage-users.styles';

function SelectCard({ icon, label, sub, onPress }: {
  icon: ReactNode; label: string; sub: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.navIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.navLabel}>{label}</Text>
        <Text style={styles.navSub}>{sub}</Text>
      </View>
      <Chevron />
    </TouchableOpacity>
  );
}

export default function ManageUsersSelectScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Manage Users" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Administration</Text>
        <SelectCard
          icon={<UsersIcon />}
          label="Users"
          sub="Browse, edit, and remove accounts; assign roles."
          onPress={() => router.push('/(app)/profile/manage-users/users')}
        />
        <SelectCard
          icon={<ShieldIcon />}
          label="Roles"
          sub="Create and manage roles available across the platform."
          onPress={() => router.push('/(app)/profile/manage-users/roles')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
