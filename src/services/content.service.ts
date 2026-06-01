import { executeApiRequest } from './api.service';
import { Microservice, RequestType } from '../types/api.types';
import { ContentDTO, SaveContentDTO, CategoryResponseDTO, CategoryDetail, UpdateCategoryDTO, TagDTO, TagDetail, UpdateTagDTO } from '../types/content.types';

export const contentService = {
  async listEntries(
    orgId: string,
    opts: {
      query?: string; status?: string; tag?: string; category?: string;
      fromDate?: string; toDate?: string; page?: number; pageSize?: number;
    } = {},
  ): Promise<ContentDTO[]> {
    const params = new URLSearchParams();
    if (opts.query) params.set('query', opts.query);
    if (opts.status) params.set('status', opts.status);
    if (opts.tag) params.set('tag', opts.tag);
    if (opts.category) params.set('category', opts.category);
    if (opts.fromDate) params.set('fromDate', opts.fromDate);
    if (opts.toDate) params.set('toDate', opts.toDate);
    params.set('page', String(opts.page ?? 1));
    params.set('pageSize', String(opts.pageSize ?? 25));
    params.set('withElastic', 'false');

    const result = await executeApiRequest<ContentDTO[] | { items: ContentDTO[] }>({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/entry?${params.toString()}`,
      type: RequestType.GET,
    });
    if (Array.isArray(result)) return result;
    if (result && Array.isArray((result as any).items)) return (result as any).items;
    return [];
  },

  async getNewId(orgId: string): Promise<string> {
    return executeApiRequest<string>({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/entry/new-id`,
      type: RequestType.GET,
    });
  },

  async getEntry(orgId: string, entryId: string): Promise<ContentDTO> {
    return executeApiRequest<ContentDTO>({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/entry/${entryId}`,
      type: RequestType.GET,
    });
  },

  async saveEntry(orgId: string, entryId: string, body: SaveContentDTO): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/entry/${entryId}`,
      type: RequestType.PUT,
      body,
    });
  },

  async unpublish(orgId: string, entryId: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/entry/${entryId}/unpublish`,
      type: RequestType.POST,
    });
  },

  async deleteEntry(orgId: string, entryId: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/entry/${entryId}`,
      type: RequestType.DELETE,
    });
  },

  async listCategories(orgId: string, search?: string): Promise<CategoryResponseDTO[]> {
    const q = search ? `&search=${encodeURIComponent(search)}` : '';
    const result = await executeApiRequest<CategoryResponseDTO[]>({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/category?page=1&pageSize=100${q}`,
      type: RequestType.GET,
    });
    return Array.isArray(result) ? result : [];
  },

  async getCategory(orgId: string, categoryId: string): Promise<CategoryDetail> {
    return executeApiRequest<CategoryDetail>({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/category/${categoryId}`,
      type: RequestType.GET,
    });
  },

  async createCategory(orgId: string, name: string, description?: string): Promise<CategoryDetail> {
    return executeApiRequest<CategoryDetail>({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/category`,
      type: RequestType.POST,
      body: { name, description },
    });
  },

  async updateCategory(orgId: string, body: UpdateCategoryDTO): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/category`,
      type: RequestType.PUT,
      body,
    });
  },

  async deleteCategory(orgId: string, categoryId: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/category/${categoryId}`,
      type: RequestType.DELETE,
    });
  },

  async listTags(orgId: string, search?: string): Promise<TagDTO[]> {
    const q = search ? `&search=${encodeURIComponent(search)}` : '';
    const result = await executeApiRequest<TagDTO[]>({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/tag?page=1&pageSize=100${q}`,
      type: RequestType.GET,
    });
    return Array.isArray(result) ? result : [];
  },

  async createTag(orgId: string, name: string): Promise<TagDetail> {
    return executeApiRequest<TagDetail>({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/tag`,
      type: RequestType.POST,
      body: { name },
    });
  },

  async updateTag(orgId: string, body: UpdateTagDTO): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/tag`,
      type: RequestType.PUT,
      body,
    });
  },

  async deleteTag(orgId: string, tagId: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/tag/${tagId}`,
      type: RequestType.DELETE,
    });
  },
};
