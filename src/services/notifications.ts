import axiosInstance from "../lib/axios";
import type {
  Notification,
  NotificationFilters,
  GetAllNotificationsResponse,
} from "../types/notification";

export const notificationService = {
  /** GET /notifications?is_read=true|false */
  getAll: async (filters: NotificationFilters = {}): Promise<GetAllNotificationsResponse> => {
    const { data } = await axiosInstance.get<GetAllNotificationsResponse>("/notifications", {
      params: filters,
    });
    return data;
  },

  /** GET /notifications/:id */
  getById: async (id: number): Promise<Notification> => {
    const { data } = await axiosInstance.get<Notification>(`/notifications/${id}`);
    return data;
  },

  /** PATCH /notifications/:id/read — mark single as read */
  markAsRead: async (id: number): Promise<Notification> => {
    const { data } = await axiosInstance.patch<Notification>(`/notifications/${id}/read`);
    return data;
  },

  /** PATCH /notifications/read-all — mark all as read */
  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.patch("/notifications/read-all");
  },

  /** DELETE /notifications/:id */
  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/notifications/${id}`);
  },
};