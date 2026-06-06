export interface NotificationItem {
  id: string;
  message: string;
  type?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  created?: string;
}

export interface NotificationsListResponse {
  success?: boolean;
  items?: NotificationItem[];
  data?: NotificationItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
}
