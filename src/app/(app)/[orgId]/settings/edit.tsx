import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../../components/layout/top-bar';
import { PrimaryBtn, GhostBtn } from '../../../../components/ui/button';
import { FormSkeleton } from '../../../../components/ui/skeletons';
import { useOrgSettings } from '../../../../viewmodels/useOrgSettings';
import { styles } from '../../../../styles/app/org-settings.styles';
import { DS } from '../../../../constants/ds';

export default function EditOrganisation() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const vm = useOrgSettings(orgId);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Organisation" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {vm.loadingRole ? (
          <FormSkeleton fields={2} />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>DETAILS</Text>
            <View style={styles.card}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={vm.editName}
                onChangeText={vm.setEditName}
                placeholder="Organisation name"
                placeholderTextColor={DS.text4}
                autoCapitalize="words"
                editable={vm.canManageOrg}
              />
              {vm.error && <Text style={styles.errorText}>{vm.error}</Text>}
              {vm.canManageOrg
                ? <PrimaryBtn label="Save Changes" full onPress={vm.handleSave} loading={vm.saving} />
                : <Text style={styles.readOnly}>You don&apos;t have permission to edit this organisation.</Text>
              }
            </View>

            {vm.canManageOrg && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: 28 }]}>DANGER ZONE</Text>
                <View style={styles.card}>
                  {vm.confirmDelete ? (
                    <>
                      <Text style={styles.confirmText}>
                        This will permanently delete the organisation and all its data. This cannot be undone.
                      </Text>
                      <View style={styles.confirmActions}>
                        <View style={{ flex: 1 }}>
                          <GhostBtn label="Cancel" full onPress={() => vm.setConfirmDelete(false)} />
                        </View>
                        <View style={{ width: 10 }} />
                        <View style={{ flex: 1 }}>
                          <PrimaryBtn label="Delete" full onPress={vm.handleDelete} loading={vm.deleting} />
                        </View>
                      </View>
                    </>
                  ) : (
                    <TouchableOpacity style={styles.deleteBtn} onPress={vm.handleDelete} activeOpacity={0.7}>
                      <Text style={styles.deleteBtnLabel}>Delete Organisation</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
