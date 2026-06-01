import { executeApiRequest } from './api.service';
import { Microservice, RequestType } from '../types/api.types';
import { Organisation, OrganisationPage, ApiKey, OrgRole } from '../types/organisation.types';

export const organisationService = {
  async list(page = 1, pageSize = 10): Promise<OrganisationPage> {
    return executeApiRequest<OrganisationPage>({
      microservice: Microservice.ORGANISATION,
      path: `/organisations?page=${page}&pageSize=${pageSize}`,
      type: RequestType.GET,
    });
  },

  async create(name: string): Promise<Organisation> {
    return executeApiRequest<Organisation>({
      microservice: Microservice.ORGANISATION,
      path: '/organisations',
      type: RequestType.POST,
      body: { name },
    });
  },

  async getOrg(orgId: string): Promise<Organisation> {
    return executeApiRequest<Organisation>({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}`,
      type: RequestType.GET,
    });
  },

  async getRole(orgId: string): Promise<OrgRole> {
    return executeApiRequest<OrgRole>({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}/role`,
      type: RequestType.GET,
    });
  },

  async updateOrg(orgId: string, name: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}`,
      type: RequestType.PUT,
      body: { name },
    });
  },

  async deleteOrg(orgId: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}`,
      type: RequestType.DELETE,
    });
  },

  async listApiKeys(orgId: string): Promise<ApiKey[]> {
    const result = await executeApiRequest<ApiKey[]>({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}/api-keys`,
      type: RequestType.GET,
    });
    return Array.isArray(result) ? result : [];
  },

  async createApiKey(orgId: string, expiresAt?: string): Promise<ApiKey> {
    return executeApiRequest<ApiKey>({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}/api-keys`,
      type: RequestType.POST,
      body: { expiresAt: expiresAt ?? null },
    });
  },

  async toggleApiKey(orgId: string, keyId: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}/api-keys/${keyId}/toggle`,
      type: RequestType.PATCH,
    });
  },

  async deleteApiKey(orgId: string, keyId: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}/api-keys/${keyId}`,
      type: RequestType.DELETE,
    });
  },
};
