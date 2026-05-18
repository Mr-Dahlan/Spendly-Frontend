export interface Notification {
  notif_id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetAllNotificationsResponse {
  success: boolean;
  unread_count: number;
  data: Notification[];
}

export interface NotificationFilters {
  is_read?: boolean;
}

export interface CreateAnnouncementPayload {
  title: string;
  message: string;
  user_id?: number | null;
}

export interface CreateAnnouncementResponse {
  success: boolean;
  message: string;
  data?: Notification | Notification[];
}