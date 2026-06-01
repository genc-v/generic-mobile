import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { organisationService } from '../services/organisation.service';
import { OrgRoleName } from '../types/organisation.types';

export function useOrgSettings(orgId: string) {
  const router = useRouter();

  const [role, setRole] = useState<OrgRoleName | null>(null);
  const [orgName, setOrgName] = useState('');
  const [editName, setEditName] = useState('');
  const [loadingRole, setLoadingRole] = useState(true);

  const [showSettings, setShowSettings] = useState(false);
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
        setOrgName(orgData.name);
        setEditName(orgData.name);
      })
      .catch(() => {})
      .finally(() => setLoadingRole(false));
  }, [orgId]);

  const canManageOrg = role === 'Admin';
  const canEdit = role === 'Admin' || role === 'Editor';

  function openSettings() {
    setEditName(orgName);
    setError(null);
    setConfirmDelete(false);
    setShowSettings(true);
  }

  async function handleSave() {
    if (!editName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await organisationService.updateOrg(orgId, editName.trim());
      setOrgName(editName.trim());
      setShowSettings(false);
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

  function handleClose() {
    setShowSettings(false);
    setConfirmDelete(false);
    setError(null);
  }

  return {
    role,
    orgName,
    loadingRole,
    canManageOrg,
    canEdit,
    showSettings,
    openSettings,
    handleClose,
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
