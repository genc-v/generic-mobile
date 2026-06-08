import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiKeyCard } from './ApiKeyCard';
import { GenerateKeySheet } from './GenerateKeySheet';
import { RevealKeySheet } from './RevealKeySheet';
import { CardListSkeleton } from '../ui/skeletons';
import { useApiKeys } from '../../viewmodels/useApiKeys';
import { styles } from '../../styles/app/api-key-card.styles';
import { DS } from '../../constants/ds';

export function ApiKeysSection({ orgId }: { orgId: string }) {
  const vm = useApiKeys(orgId);
  const insets = useSafeAreaInsets();

  return (
    <>
      {vm.loading ? (
        <CardListSkeleton rows={3} />
      ) : vm.error ? (
        <View style={styles.centred}>
          <Text style={styles.errorText}>{vm.error}</Text>
          <TouchableOpacity onPress={vm.fetch}>
            <Text style={styles.retryLabel}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : vm.keys.length === 0 ? (
        <View style={styles.centred}>
          <Text style={styles.emptyText}>No API keys yet.</Text>
          <Text style={styles.emptyHint}>Tap + Generate Key to create one.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {vm.keys.map(k => (
            <ApiKeyCard
              key={k.id}
              apiKey={k}
              toggling={vm.togglingId === k.id}
              deleting={vm.deletingId === k.id}
              onToggle={() => vm.handleToggle(k.id)}
              onDelete={() => vm.handleDelete(k.id)}
            />
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 64 }]}
        onPress={() => vm.setShowGenerate(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabPlus}>+</Text>
        <Text style={styles.fabLabel}>Generate Key</Text>
      </TouchableOpacity>

      <GenerateKeySheet
        visible={vm.showGenerate}
        expiry={vm.expiry}
        generating={vm.generating}
        error={vm.generateError}
        onExpiryChange={vm.setExpiry}
        onGenerate={vm.handleGenerate}
        onClose={() => vm.setShowGenerate(false)}
      />
      <RevealKeySheet
        apiKey={vm.newKey}
        copied={vm.copied}
        onCopy={vm.handleCopyKey}
        onDismiss={vm.dismissReveal}
      />
    </>
  );
}
