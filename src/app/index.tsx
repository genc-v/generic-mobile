import { View } from 'react-native';
import { useAppEntry } from '../viewmodels/useAppEntry';
import { DS } from '../constants/ds';

export default function Index() {
  useAppEntry();
  return <View style={{ flex: 1, backgroundColor: DS.bg }} />;
}
