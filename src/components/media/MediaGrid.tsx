import { View, Text, TouchableOpacity, FlatList, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { AssetItem } from '../../types/asset.types';
import { FileIcon } from './MediaIcons';
import { styles } from '../../styles/app/media.styles';
import { DS } from '../../constants/ds';

type Props = {
  assets: AssetItem[];
  onPress: (asset: AssetItem) => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
};

const COLS = 3;
const GAP = 10;
const PADDING = 16;

function formatDate(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function MediaGrid({ assets, onPress, onEndReached, loadingMore }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.floor((width - PADDING * 2 - GAP * (COLS - 1)) / COLS);

  return (
    <FlatList
      data={assets}
      numColumns={COLS}
      keyExtractor={item => item.key}
      contentContainerStyle={styles.scroll}
      columnWrapperStyle={{ gap: GAP }}
      ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        loadingMore
          ? <ActivityIndicator style={{ marginVertical: 16 }} color={DS.text3} />
          : null
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.card, { width: cardWidth }]}
          onPress={() => onPress(item)}
          activeOpacity={0.75}
        >
          <View style={styles.thumb}>
            {item.isImage ? (
              <Image source={{ uri: item.url }} style={styles.thumbImage} contentFit="cover" transition={150} />
            ) : (
              <FileIcon />
            )}
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName} numberOfLines={1} ellipsizeMode="middle">
              {item.name}
            </Text>
            <Text style={styles.cardDate} numberOfLines={1}>
              {formatDate(item.lastModified) || item.ext.toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
