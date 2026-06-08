import { View, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import { AssetItem } from '../../types/asset.types';
import { ImageIcon } from './MediaIcons';
import { styles } from '../../styles/app/media-modal.styles';
import { DS } from '../../constants/ds';

type Props = {
  visible: boolean;
  asset: AssetItem | null;
  loading: boolean;
  canEdit: boolean;
  deleting: boolean;
  copied: boolean;
  error: string | null;
  onCopy: (url: string) => void;
  onDelete: (key: string) => void;
  onClose: () => void;
};

function formatSize(bytes?: number): string | null {
  if (bytes == null) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value?: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function AssetDetailSheet({
  visible, asset, loading, canEdit, deleting, copied, error,
  onCopy, onDelete, onClose,
}: Props) {
  if (!asset) return null;

  const rows: { label: string; value: string; link?: boolean }[] = [
    { label: 'File name', value: asset.name },
    { label: 'Type', value: asset.contentType || (asset.ext ? `.${asset.ext}` : 'Unknown') },
  ];
  const size = formatSize(asset.size);
  if (size) rows.push({ label: 'Size', value: size });
  const uploaded = formatDate(asset.lastModified);
  if (uploaded) rows.push({ label: 'Uploaded', value: uploaded });
  if (asset.entryId) rows.push({ label: 'Linked entry', value: asset.entryId, link: true });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="fullScreen">
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Asset Detail</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={10} activeOpacity={0.7}>
            <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
              <Path d="M2 2l9 9M11 2l-9 9" stroke={DS.text1} strokeWidth={1.4} strokeLinecap="round" />
            </Svg>
            <Text style={styles.closeLabel}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.preview}>
            {asset.isImage ? (
              <Image source={{ uri: asset.url }} style={styles.previewImage} contentFit="cover" transition={150} />
            ) : (
              <>
                <ImageIcon size={40} />
                <Text style={styles.previewName}>{asset.name}</Text>
              </>
            )}
          </View>

          <View style={styles.detailBody}>
            {loading && (
              <View style={{ paddingVertical: 8 }}>
                <ActivityIndicator size="small" color={DS.text3} />
              </View>
            )}

            {rows.map(row => (
              <View key={row.label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={[styles.infoValue, row.link && styles.infoValueLink]} numberOfLines={1} ellipsizeMode="middle">
                  {row.value}
                </Text>
              </View>
            ))}

            <View style={styles.urlSection}>
              <Text style={styles.urlLabel}>URL</Text>
              <View style={styles.urlBox}>
                <Text style={styles.urlText} numberOfLines={1} ellipsizeMode="middle">{asset.url}</Text>
                <TouchableOpacity onPress={() => onCopy(asset.url)} hitSlop={8} activeOpacity={0.6}>
                  <Text style={[styles.urlCopy, copied && styles.urlCopied]}>{copied ? 'Copied' : 'Copy'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {error && <Text style={styles.detailError}>{error}</Text>}

            {canEdit && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => onDelete(asset.key)}
                disabled={deleting}
                activeOpacity={0.7}
              >
                {deleting
                  ? <ActivityIndicator size="small" color={DS.red} />
                  : <Text style={styles.deleteBtnLabel}>Delete Asset</Text>}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
