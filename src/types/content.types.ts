export interface TagDTO {
  tagId: string;
  name: string | null;
}

export interface CategoryResponseDTO {
  categoryId: string;
  name: string | null;
}

export interface ContentDTO {
  contentId: string;
  title: string | null;
  slug: string | null;
  richContent: string | null;
  assetUrl: string | null;
  status: string | null;
  categoryId: string | null;
  categoryName: string | null;
  organisationId: string;
  createdOn: string;
  updatedOn: string;
  tags: TagDTO[] | null;
}

export interface SaveContentDTO {
  title?: string;
  richContent?: string;
  assetUrl?: string;
  categoryId?: string;
  categoryName?: string;
  tags?: TagDTO[];
}
