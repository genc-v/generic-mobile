import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import * as Clipboard from 'expo-clipboard';
import { ApiKey } from '../../types/organisation.types';
import { DS } from '../../constants/ds';
import { styles } from '../../styles/app/api-key-card.styles';

function formatDate(iso: string | null): string {
  if (!iso) return 'No expiry';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function truncateKey(key: string): string {
  if (key.length <= 24) return key;
  return `${key.slice(0, 10)}…${key.slice(-6)}`;
}

function CopyIcon({ color }: { color: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Rect x={4} y={4} width={8} height={9} rx={1.2} stroke={color} strokeWidth={1.2} />
      <Path d="M4 3V2.8A1.2 1.2 0 0 1 5.2 1.6h4a1.2 1.2 0 0 1 1.2 1.2v.2" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

function TrashIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
      <Path d="M2 4h10M5 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4M3 4l.7 7.5a.5.5 0 0 0 .5.5h5.6a.5.5 0 0 0 .5-.5L11 4" stroke={DS.text3} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

type Props = {
  apiKey: ApiKey;
  toggling: boolean;
  deleting: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export function ApiKeyCard({ apiKey, toggling, deleting, onToggle, onDelete }: Props) {
  const active = apiKey.isActive;
  const [copied, setCopied] = useState(false);

  const expiresAt = apiKey.expiresAt;
  const expired = expiresAt && new Date(expiresAt) < new Date();
  const expiryColor = expired ? DS.red : DS.text3;

  async function handleCopy() {
    await Clipboard.setStringAsync(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <View style={styles.card}>
      <View style={styles.keyRow}>
        <Text style={styles.keyText} numberOfLines={1}>
          {truncateKey(apiKey.key)}
        </Text>

        <TouchableOpacity style={styles.copyIconBtn} onPress={handleCopy} activeOpacity={0.6} hitSlop={8}>
          <CopyIcon color={copied ? '#22C55E' : DS.text3} />
        </TouchableOpacity>

        {toggling ? (
          <ActivityIndicator size="small" color={DS.accent} />
        ) : (
          <TouchableOpacity
            style={[
              styles.toggle,
              { backgroundColor: active ? DS.accent : DS.surface3, borderWidth: 1, borderColor: active ? DS.accentBorder : DS.border2 },
            ]}
            onPress={onToggle}
            activeOpacity={0.8}
          >
            <View style={[styles.toggleThumb, { alignSelf: active ? 'flex-end' : 'flex-start' }]} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {new Date(apiKey.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={[styles.metaText, { color: expiryColor }]}>
          {formatDate(expiresAt)}
        </Text>

        <View style={styles.metaSpacer} />

        <View style={[
          styles.badge,
          { backgroundColor: active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)', borderColor: active ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)' },
        ]}>
          <View style={[styles.badgeDot, { backgroundColor: active ? DS.green : DS.red }]} />
          <Text style={[styles.badgeLabel, { color: active ? DS.green : DS.red }]}>
            {active ? 'Active' : 'Inactive'}
          </Text>
        </View>

        {deleting ? (
          <ActivityIndicator size="small" color={DS.red} style={{ marginLeft: 4 }} />
        ) : (
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} activeOpacity={0.7} hitSlop={8}>
            <TrashIcon />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
