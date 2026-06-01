import { executeApiRequest } from './api.service';
import { Microservice, RequestType } from '../types/api.types';
import { Profile, UpdateProfileBody } from '../types/profile.types';

export const profileService = {
  async get(): Promise<Profile> {
    return executeApiRequest<Profile>({
      microservice: Microservice.PROFILE,
      type: RequestType.GET,
    });
  },

  async update(body: Partial<UpdateProfileBody>): Promise<Profile> {
    return executeApiRequest<Profile>({
      microservice: Microservice.PROFILE,
      type: RequestType.PUT,
      body,
    });
  },
};
