import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../../components/layout/top-bar';
import { PrimaryBtn } from '../../../../components/ui/button';
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
              {vm.canManageOrg
                ? <PrimaryBtn label="Save Changes" full onPress={vm.handleSave} loading={vm.saving} />
                : <Text style={styles.readOnly}>You don&apos;t have permission to edit this organisation.</Text>
              }
            </View>

            {vm.canManageOrg && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: 28 }]}>DANGER ZONE</Text>
                <View style={styles.card}>
                  <TouchableOpacity style={styles.deleteBtn} onPress={vm.handleDelete} disabled={vm.deleting} activeOpacity={0.7}>
                    {vm.deleting
                      ? <ActivityIndicator color={DS.red} />
                      : <Text style={styles.deleteBtnLabel}>Delete Organisation</Text>}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
