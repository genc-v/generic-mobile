import { View, Text, Image, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { StatusPill, STATUS_COLOR } from './StatusPill';
import { Markdown } from './Markdown';
import { TagDTO } from '../../types/content.types';
import { styles } from '../../styles/app/entry-preview.styles';
import { DS } from '../../constants/ds';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  richContent: string;
  status: string;
  categoryName: string | null;
  assetUrl: string | null;
  tags: TagDTO[];
  updatedOn?: string;
};

export function EntryPreviewModal({
  visible, onClose, title, richContent, status, categoryName, assetUrl, tags, updatedOn,
}: Props) {
  const statusColor = STATUS_COLOR[status] ?? DS.text3;
  const dateLabel = updatedOn
    ? new Date(updatedOn).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
    : null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="fullScreen">
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.headerLabel}>Preview</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={10} activeOpacity={0.7}>
            <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
              <Path d="M2 2l9 9M11 2l-9 9" stroke={DS.text1} strokeWidth={1.4} strokeLinecap="round" />
            </Svg>
            <Text style={styles.closeLabel}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            {assetUrl
              ? <Image source={{ uri: assetUrl }} style={styles.heroImage} resizeMode="cover" />
              : <Text style={styles.heroEmpty}>No image</Text>
            }
          </View>

          <StatusPill label={status} color={statusColor} />

          <Text style={[styles.title, !title && styles.titleEmpty]}>
            {title || 'Untitled'}
          </Text>

          <View style={styles.meta}>
            {categoryName && <Text style={styles.metaText}>{categoryName}</Text>}
            {categoryName && dateLabel && <View style={styles.metaDot} />}
            {dateLabel && <Text style={styles.metaText}>{dateLabel}</Text>}
          </View>

          {richContent
            ? <Markdown content={richContent} style={styles.body} />
            : <Text style={[styles.body, styles.bodyEmpty]}>No content yet.</Text>
          }

          {tags.length > 0 && (
            <View style={styles.tagsRow}>
              {tags.map(t => (
                <View key={t.tagId} style={styles.tag}>
                  <Text style={styles.tagLabel}>{t.name}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
