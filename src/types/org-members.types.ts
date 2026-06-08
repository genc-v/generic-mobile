export interface OrgMember {
  id: string;
  userId: string;
  organisationId: string;
  role: string;
}

export interface OrgMembersPage {
  items: OrgMember[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface UserPublicProfile {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

export interface OrgMemberWithProfile extends OrgMember {
  profile: UserPublicProfile | null;
}
