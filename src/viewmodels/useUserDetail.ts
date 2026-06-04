import { useState, useEffect } from 'react';
import { userManagementService } from '../services/user-management.service';
import { confirm, notify } from '../utils/confirm';
import { ManagedUser, Role, UserRole } from '../types/user-management.types';

// Drives the per-user detail sheet: edit username/email, assign or remove
// roles, and delete the account. The host remounts this per user (keyed by id),
// so initial form values come from `useState` initializers rather than an effect.
// `onChanged` triggers a list refresh.
export function useUserDetail(user: ManagedUser, onChanged: () => void, onClose: () => void) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [pendingRole, setPendingRole] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      userManagementService.listRoles(),
      userManagementService.getUserRoles(user.id),
    ])
      .then(([roles, assigned]) => {
        if (!active) return;
        setAllRoles(roles);
        setUserRoles(assigned);
      })
      .catch(() => { if (active) setError('Failed to load roles.'); })
      .finally(() => { if (active) setLoadingRoles(false); });

    return () => { active = false; };
  }, [user.id]);

  function hasRole(roleId: string) {
    return userRoles.some(r => r.roleId === roleId);
  }

  // Tapping a chip asks for confirmation (system dialog) before changing roles.
  async function toggleRole(role: Role) {
    if (pendingRole) return;
    const granting = !hasRole(role.id);

    // Every user must keep at least one role — block removing the last one.
    if (!granting && userRoles.length <= 1) {
      await notify('At least one role required', 'A user must keep at least one role.');
      return;
    }

    const ok = await confirm({
      title: granting ? 'Grant role' : 'Remove role',
      message: granting
        ? `Give ${user.username} the "${role.name}" role?`
        : `Remove the "${role.name}" role from ${user.username}?`,
      confirmLabel: granting ? 'Grant' : 'Remove',
      destructive: !granting,
    });
    if (!ok) return;

    setPendingRole(role.id);
    try {
      if (granting) {
        const assigned = await userManagementService.assignRole(user.id, role.id);
        setUserRoles(prev => [...prev, assigned]);
      } else {
        await userManagementService.removeRole(user.id, role.id);
        setUserRoles(prev => prev.filter(r => r.roleId !== role.id));
      }
    } catch {
      await notify('Something went wrong', `Failed to update the "${role.name}" role.`);
    } finally {
      setPendingRole(null);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await userManagementService.updateUser(user.id, { username, email });
      setSuccess(true);
      onChanged();
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    const ok = await confirm({
      title: 'Delete user',
      message: `Permanently delete ${user.username} (${user.email})? This cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;

    setDeleting(true);
    setError(null);
    try {
      await userManagementService.deleteUser(user.id);
      onChanged();
      onClose();
    } catch {
      await notify('Something went wrong', 'Failed to delete this user.');
      setDeleting(false);
    }
  }

  return {
    username, setUsername,
    email, setEmail,
    allRoles, loadingRoles, hasRole, pendingRole, toggleRole,
    saving, save,
    deleting, remove,
    error, success,
  };
}
