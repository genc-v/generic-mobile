import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle } from 'react-native-svg';
import { TopBar } from '../../../../components/layout/top-bar';
import { styles } from '../../../../styles/app/org-settings.styles';
import { DS } from '../../../../constants/ds';

function OrgIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Path d="M3 15.5V4.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v11M11 7.5h3a1 1 0 0 1 1 1v7M2 15.5h14" stroke={DS.text1} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5.5 6.5h3M5.5 9h3M5.5 11.5h3" stroke={DS.text1} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

function UsersIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Circle cx={7} cy={6} r={2.5} stroke={DS.text1} strokeWidth={1.4} />
      <Path d="M2.5 14a4.5 4.5 0 0 1 9 0" stroke={DS.text1} strokeWidth={1.4} strokeLinecap="round" />
      <Circle cx={13} cy={6.5} r={1.8} stroke={DS.text1} strokeWidth={1.4} />
      <Path d="M11 14a3.5 3.5 0 0 1 5 0" stroke={DS.text1} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

function KeyIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Circle cx={6} cy={9} r={3} stroke={DS.text1} strokeWidth={1.4} />
      <Path d="M9 9h7M13.5 9v2.5M16 9v2.5" stroke={DS.text1} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

function NavRow({ icon, label, sub, onPress }: { icon: React.ReactNode; label: string; sub: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.navRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.navIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.navLabel}>{label}</Text>
        <Text style={styles.navSub}>{sub}</Text>
      </View>
      <Svg width={7} height={12} viewBox="0 0 7 12" fill="none">
        <Path d="M1 1l5 5-5 5" stroke={DS.text3} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </TouchableOpacity>
  );
}

export default function SettingsMenu() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Settings" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>MANAGE</Text>
        <NavRow
          icon={<OrgIcon />}
          label="Organisation"
          sub="Name and deletion"
          onPress={() => router.push(`/(app)/${orgId}/settings/edit`)}
        />
        <NavRow
          icon={<UsersIcon />}
          label="Users"
          sub="Members and roles"
          onPress={() => router.push(`/(app)/${orgId}/settings/users`)}
        />
        <NavRow
          icon={<KeyIcon />}
          label="API Keys"
          sub="Access tokens"
          onPress={() => router.push(`/(app)/${orgId}/settings/apikey`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
