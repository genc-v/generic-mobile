import { useState, useCallback, useRef } from 'react';
import { orgMembersService } from '../services/org-members.service';
import { confirm } from '../utils/confirm';
import { toast } from '../utils/toast';
import { OrgMemberWithProfile, UserPublicProfile } from '../types/org-members.types';

const PAGE_SIZE = 20;

export const ORG_ROLES = ['Admin', 'Editor', 'Viewer'] as const;
export type OrgRole = typeof ORG_ROLES[number];

async function enrichWithProfiles(
  members: OrgMemberWithProfile[],
): Promise<OrgMemberWithProfile[]> {
  const userIds = members.map(m => m.userId);
  const profiles = await orgMembersService.getProfiles(userIds);
  const profileMap = new Map<string, UserPublicProfile>(
    profiles.map(p => [p.userId, p]),
  );
  return members.map(m => ({ ...m, profile: profileMap.get(m.userId) ?? null }));
}

export function useOrgMembers(orgId: string) {
  const [members, setMembers] = useState<OrgMemberWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detail sheet
  const [detailMember, setDetailMember] = useState<OrgMemberWithProfile | null>(null);

  // Add sheet
  const [addSheetVisible, setAddSheetVisible] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState<OrgRole>('Viewer');

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<UserPublicProfile | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [addLoading, setAddLoading] = useState(false);

  // Role change (inside detail sheet)
  const [roleUpdating, setRoleUpdating] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const pageRef = useRef(1);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    pageRef.current = 1;
    try {
      const page = await orgMembersService.listMembers(orgId, 1, PAGE_SIZE);
      const base: OrgMemberWithProfile[] = page.items.map(m => ({ ...m, profile: null }));
      const enriched = await enrichWithProfiles(base);
      setMembers(enriched);
      setHasMore(page.pageNumber < page.totalPages);
    } catch (e: any) {
      const msg = e?.message ?? 'Failed to load members.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const page = await orgMembersService.listMembers(orgId, nextPage, PAGE_SIZE);
      const base: OrgMemberWithProfile[] = page.items.map(m => ({ ...m, profile: null }));
      const enriched = await enrichWithProfiles(base);
      setMembers(prev => {
        const existingIds = new Set(prev.map(m => m.userId));
        return [...prev, ...enriched.filter(m => !existingIds.has(m.userId))];
      });
      setHasMore(page.pageNumber < page.totalPages);
      pageRef.current = nextPage;
    } catch {
      // Non-critical.
    } finally {
      setLoadingMore(false);
    }
  }, [orgId, loadingMore, hasMore]);

  function openAddSheet() {
    setAddEmail('');
    setAddRole('Viewer');
    setSearchResult(null);
    setSearchError(null);
    setAddSheetVisible(true);
  }

  function closeAddSheet() {
    setAddSheetVisible(false);
    setAddEmail('');
    setSearchResult(null);
    setSearchError(null);
  }

  async function searchByEmail() {
    const email = addEmail.trim();
    if (!email) return;
    setSearchLoading(true);
    setSearchResult(null);
    setSearchError(null);
    try {
      const profile = await orgMembersService.lookupByEmail(email);
      setSearchResult(profile);
    } catch {
      setSearchError('No user found with that email.');
    } finally {
      setSearchLoading(false);
    }
  }

  async function addMember() {
    if (!searchResult) return;
    setAddLoading(true);
    try {
      const member = await orgMembersService.addMember(orgId, searchResult.userId, addRole);
      const newMember: OrgMemberWithProfile = { ...member, profile: searchResult };
      setMembers(prev => [newMember, ...prev]);
      closeAddSheet();
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to add member.');
    } finally {
      setAddLoading(false);
    }
  }

  async function updateRole(member: OrgMemberWithProfile, role: string) {
    setRoleUpdating(true);
    try {
      await orgMembersService.updateRole(orgId, member.userId, role);
      const updated = { ...member, role };
      setMembers(prev => prev.map(m => m.userId === member.userId ? updated : m));
      setDetailMember(updated);
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to update role.');
    } finally {
      setRoleUpdating(false);
    }
  }

  async function removeMember(member: OrgMemberWithProfile) {
    const name = member.profile?.displayName ?? 'this member';
    const ok = await confirm({
      title: 'Remove member',
      message: `Remove ${name} from this organisation?`,
      confirmLabel: 'Remove',
      destructive: true,
    });
    if (!ok) return;
    setRemovingId(member.userId);
    try {
      await orgMembersService.removeMember(orgId, member.userId);
      setMembers(prev => prev.filter(m => m.userId !== member.userId));
      setDetailMember(null);
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to remove member.');
    } finally {
      setRemovingId(null);
    }
  }

  return {
    members, loading, loadingMore, hasMore, error,
    load, loadMore,
    detailMember, setDetailMember,
    addSheetVisible, openAddSheet, closeAddSheet,
    addEmail, setAddEmail,
    addRole, setAddRole,
    searchLoading, searchResult, searchError, searchByEmail,
    addLoading, addMember,
    roleUpdating, updateRole,
    removingId, removeMember,
  };
}
