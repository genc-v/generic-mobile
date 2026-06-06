import * as SecureStore from 'expo-secure-store';
import { uploadAsync, FileSystemUploadType } from 'expo-file-system/legacy';
import { executeApiRequest } from './api.service';
import { authService, SECURE_STORE_KEYS } from './auth.service';
import { Microservice, RequestType } from '../types/api.types';
import { Profile, UpdateProfileBody } from '../types/profile.types';

const UPLOAD_BASE_URL = process.env.EXPO_PUBLIC_ASSET_API_URL ?? 'https://nest.jonfjz.dev';

export const profileService = {
  async get(): Promise<Profile> {
    return executeApiRequest<Profile>({
      microservice: Microservice.PROFILE,
      type: RequestType.GET,
    });
  },

  async uploadAvatar(file: { uri: string; name: string; type: string }): Promise<string> {
    await authService.checkAndRefreshJwt();
    const jwt = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
    const endpoint = `${UPLOAD_BASE_URL}/users/upload`;

    const result = await uploadAsync(endpoint, file.uri, {
      uploadType: FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      mimeType: file.type,
      headers: {
        accept: '*/*',
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      },
    });

    if (result.status < 200 || result.status >= 300) {
      throw new Error(`Avatar upload failed (${result.status})`);
    }

    const json = JSON.parse(result.body ?? '{}');
    return json.url as string;
  },

  async update(body: Partial<UpdateProfileBody>): Promise<Profile> {
    return executeApiRequest<Profile>({
      microservice: Microservice.PROFILE,
      type: RequestType.PUT,
      body,
    });
  },
};
