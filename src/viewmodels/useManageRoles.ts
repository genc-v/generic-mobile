import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { userManagementService } from '../services/user-management.service';
import { confirm } from '../utils/confirm';
import { toast } from '../utils/toast';
import { Role } from '../types/user-management.types';

export function useManageRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create/edit sheet. `editing` is null when creating a new role.
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRoles(await userManagementService.listRoles());
    } catch (e: any) {
      const msg = e?.message ?? 'Failed to load roles.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  function openCreate() {
    setEditing(null);
    setName('');
    setDescription('');
    setSheetError(null);
    setSheetOpen(true);
  }

  function openEdit(role: Role) {
    setEditing(role);
    setName(role.name);
    setDescription(role.description ?? '');
    setSheetError(null);
    setSheetOpen(true);
  }

  function closeSheet() {
    setSheetOpen(false);
  }

  async function save() {
    if (!name.trim()) { toast.info('A role name is required.'); return; }
    setSaving(true);
    try {
      const body = { name: name.trim(), description: description.trim() || null };
      if (editing) {
        await userManagementService.updateRole(editing.id, body);
      } else {
        await userManagementService.createRole(body);
      }
      setSheetOpen(false);
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to save the role.');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!editing) return;
    const ok = await confirm({
      title: 'Delete role',
      message: `Delete the "${editing.name}" role? Any users assigned to it will lose it.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;

    setDeleting(true);
    try {
      await userManagementService.deleteRole(editing.id);
      setSheetOpen(false);
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to delete the role.');
    } finally {
      setDeleting(false);
    }
  }

  return {
    roles, loading, error, refresh: load,
    sheetOpen, editing, openCreate, openEdit, closeSheet,
    name, setName, description, setDescription,
    saving, save, deleting, remove,
  };
}
