import { Stack } from 'expo-router';
import { DS } from '../../../constants/ds';

export default function OrgLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: DS.bg },
      }}
    />
  );
}
