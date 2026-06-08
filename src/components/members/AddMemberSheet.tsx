import { View, Text, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserPublicProfile } from '../../types/org-members.types';
import { ORG_ROLES, OrgRole } from '../../viewmodels/useOrgMembers';
import { Input } from '../ui/input';
import { GhostBtn, PrimaryBtn } from '../ui/button';
import { UserPreviewCard } from './UserPreviewCard';
import { styles } from '../../styles/app/org-members.styles';

type Props = {
  email: string;
  onEmailChange: (v: string) => void;
  role: OrgRole;
  onRoleChange: (r: OrgRole) => void;
  searchLoading: boolean;
  searchResult: UserPublicProfile | null;
  searchError: string | null;
  onSearch: () => void;
  addLoading: boolean;
  onAdd: () => void;
  onClose: () => void;
};

export function AddMemberSheet({
  email, onEmailChange, role, onRoleChange,
  searchLoading, searchResult, searchError, onSearch,
  addLoading, onAdd, onClose,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheetWrapper}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.handle} />
              <Text style={styles.sheetTitle}>Add member</Text>
              <Text style={styles.sheetSubtitle}>Search by email to find a user.</Text>

              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 }}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Email"
                    placeholder="user@example.com"
                    value={email}
                    onChangeText={onEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={{ marginBottom: 16 }}>
                  <GhostBtn label="Search" onPress={onSearch} loading={searchLoading} disabled={!email.trim()} />
                </View>
              </View>

              {searchError ? (
                <Text style={styles.errorText}>{searchError}</Text>
              ) : searchResult ? (
                <>
                  <UserPreviewCard profile={searchResult} />
                  <View style={styles.divider} />
                  <Text style={styles.sectionLabel}>PERMISSION</Text>
                  <View style={[styles.chipsRow, { marginBottom: 20 }]}>
                    {ORG_ROLES.map(r => (
                      <TouchableOpacity
                        key={r}
                        style={[styles.chip, role === r && styles.chipActive]}
                        onPress={() => onRoleChange(r)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.chipText, role === r && styles.chipTextActive]}>{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <PrimaryBtn label="Add member" full onPress={onAdd} loading={addLoading} />
                </>
              ) : null}
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
