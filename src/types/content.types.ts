export interface TagDTO {
  tagId: string;
  name: string | null;
}

export interface TagDetail {
  tagId: string;
  name: string;
  organisationId: string;
  userId: string;
}

export interface UpdateTagDTO {
  tagId: string;
  name: string;
}

export interface CategoryResponseDTO {
  categoryId: string;
  name: string | null;
}

export interface CategoryDetail {
  categoryId: string;
  name: string;
  description: string | null;
  organisationId: string;
  userId: string;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  categoryId: string;
  name: string;
  description?: string;
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
