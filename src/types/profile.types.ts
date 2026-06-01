export interface Profile {
  userId: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  phoneNumber: string | null;
  timezone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileBody {
  displayName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  bio: string;
  phoneNumber: string;
  timezone: string;
}
