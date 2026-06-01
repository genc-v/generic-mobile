import { executeApiRequest } from './api.service';
import { Microservice, RequestType } from '../types/api.types';
import { ContentDTO, SaveContentDTO } from '../types/content.types';

export const contentService = {
  async listEntries(orgId: string): Promise<ContentDTO[]> {
    const result = await executeApiRequest<ContentDTO[]>({
      microservice: Microservice.CONTENT,
      path: `/${orgId}/entry`,
      type: RequestType.GET,
    });
    return Array.isArray(result) ? result : [];
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
};
