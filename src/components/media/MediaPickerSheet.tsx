import { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { assetService } from '../../services/asset.service';
import { AssetItem } from '../../types/asset.types';
import { MediaGrid } from './MediaGrid';
import { GridSkeleton } from '../ui/skeletons';
import { styles } from '../../styles/app/media-modal.styles';
import { DS } from '../../constants/ds';

type Props = {
  visible: boolean;
  orgId: string;
  onSelect: (url: string) => void;
  onClose: () => void;
};

export function MediaPickerSheet({ visible, orgId, onSelect, onClose }: Props) {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    setError(null);
    assetService.list(orgId)
      .then(result => setAssets(result.items))
      .catch(() => setError('Failed to load media.'))
      .finally(() => setLoading(false));
  }, [visible, orgId]);

  function handlePress(asset: AssetItem) {
    onSelect(asset.url);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="fullScreen">
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose from Media</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={10} activeOpacity={0.7}>
            <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
              <Path d="M2 2l9 9M11 2l-9 9" stroke={DS.text1} strokeWidth={1.4} strokeLinecap="round" />
            </Svg>
            <Text style={styles.closeLabel}>Close</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <GridSkeleton items={9} />
        ) : error ? (
          <View style={[styles.centred, { flex: 1 }]}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : assets.length === 0 ? (
          <View style={[styles.centred, { flex: 1 }]}>
            <Text style={styles.emptyText}>No media yet.</Text>
          </View>
        ) : (
          <MediaGrid assets={assets} onPress={handlePress} />
        )}
      </SafeAreaView>
    </Modal>
  );
}
