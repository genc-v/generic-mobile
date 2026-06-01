import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { organisationService } from '../services/organisation.service';
import { cache, CACHE_KEYS } from '../utils/cache';
import { OrgRoleName } from '../types/organisation.types';

export function useOrgSettings(orgId: string) {
  const router = useRouter();

  const cachedRole = cache.getSync<OrgRoleName>(CACHE_KEYS.orgRole(orgId)) ?? null;
  const cachedName = cache.getSync<string>(CACHE_KEYS.org(orgId)) ?? '';

  const [role, setRole] = useState<OrgRoleName | null>(cachedRole);
  const [editName, setEditName] = useState(cachedName);
  const [loadingRole, setLoadingRole] = useState(!(cachedRole && cachedName));

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!(cachedRole && cachedName)) {
      Promise.all([
        cache.get<OrgRoleName>(CACHE_KEYS.orgRole(orgId)),
        cache.get<string>(CACHE_KEYS.org(orgId)),
      ]).then(([r, n]) => {
        if (!active) return;
        if (r) setRole(r);
        if (n) setEditName(n);
        if (r && n) setLoadingRole(false);
      });
    }

    Promise.all([
      organisationService.getRole(orgId),
      organisationService.getOrg(orgId),
    ])
      .then(([roleData, orgData]) => {
        if (!active) return;
        setRole(roleData.role);
        setEditName(orgData.name);
        cache.set(CACHE_KEYS.orgRole(orgId), roleData.role);
        cache.set(CACHE_KEYS.org(orgId), orgData.name);
      })
      .catch(() => {})
      .finally(() => { if (active) setLoadingRole(false); });

    return () => { active = false; };
  }, [orgId]);

  const canManageOrg = role === 'Admin';
  const canEdit = role === 'Admin' || role === 'Editor';

  async function handleSave() {
    if (!editName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await organisationService.updateOrg(orgId, editName.trim());
      cache.set(CACHE_KEYS.org(orgId), editName.trim());
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
      cache.remove(CACHE_KEYS.org(orgId));
      cache.remove(CACHE_KEYS.orgRole(orgId));
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
