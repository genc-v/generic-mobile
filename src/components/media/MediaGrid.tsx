import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { AssetItem } from '../../types/asset.types';
import { FileIcon } from './MediaIcons';
import { styles } from '../../styles/app/media.styles';

type Props = {
  assets: AssetItem[];
  onPress: (asset: AssetItem) => void;
};

function formatDate(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function MediaGrid({ assets, onPress }: Props) {
  const { width } = useWindowDimensions();
  // 16px scroll padding each side, 10px gap between the 3 columns.
  const cardWidth = (width - 32 - 20) / 3;

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.grid}>
        {assets.map(asset => (
          <TouchableOpacity
            key={asset.key}
            style={[styles.card, { width: cardWidth }]}
            onPress={() => onPress(asset)}
            activeOpacity={0.75}
          >
            <View style={styles.thumb}>
              {asset.isImage ? (
                <Image source={{ uri: asset.url }} style={styles.thumbImage} contentFit="cover" transition={150} />
              ) : (
                <FileIcon />
              )}
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName} numberOfLines={1} ellipsizeMode="middle">
                {asset.name}
              </Text>
              <Text style={styles.cardDate} numberOfLines={1}>
                {formatDate(asset.lastModified) || asset.ext.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
