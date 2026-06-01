import { executeApiRequest } from './api.service';
import { Microservice, RequestType } from '../types/api.types';
import { Organisation, OrganisationPage } from '../types/organisation.types';

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
};
