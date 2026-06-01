export interface Organisation {
  id: string;
  name: string;
  slug?: string;
  createdAt?: string;
  memberCount?: number;
  role?: string;
}

export interface OrganisationPage {
  items: Organisation[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// POST /organisations — raw org object (no success/data wrapper)
export type CreateOrganisationResponse = Organisation;
