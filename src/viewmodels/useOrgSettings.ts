import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { organisationService } from '../services/organisation.service';
import { OrgRoleName } from '../types/organisation.types';

export function useOrgSettings(orgId: string) {
  const router = useRouter();

  const [role, setRole] = useState<OrgRoleName | null>(null);
  const [editName, setEditName] = useState('');
  const [loadingRole, setLoadingRole] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      organisationService.getRole(orgId),
      organisationService.getOrg(orgId),
    ])
      .then(([roleData, orgData]) => {
        setRole(roleData.role);
        setEditName(orgData.name);
      })
      .catch(() => {})
      .finally(() => setLoadingRole(false));
  }, [orgId]);

  const canManageOrg = role === 'Admin';
  const canEdit = role === 'Admin' || role === 'Editor';

  async function handleSave() {
    if (!editName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await organisationService.updateOrg(orgId, editName.trim());
    } catch {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await organisationService.deleteOrg(orgId);
      router.replace('/(app)');
    } catch {
      setError('Failed to delete organisation.');
      setDeleting(false);
    }
  }

  return {
    role,
    loadingRole,
    canManageOrg,
    canEdit,
    editName,
    setEditName,
    saving,
    deleting,
    confirmDelete,
    setConfirmDelete,
    error,
    handleSave,
    handleDelete,
  };
}
