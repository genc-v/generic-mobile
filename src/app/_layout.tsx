import { View } from 'react-native';
import { Stack } from 'expo-router';
import { enableFreeze } from 'react-native-screens';
import { DS } from '../constants/ds';
import { ToastContainer } from '../components/ui/ToastContainer';

// Disable react-freeze globally: when navigating back it suspends the
// outgoing screen the moment it loses focus, blanking it mid-transition.
enableFreeze(false);

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: DS.bg }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: DS.bg },
          animation: 'default',
          gestureEnabled: true,
        }}
      />
      <ToastContainer />
    </View>
  );
}
