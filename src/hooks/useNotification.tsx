import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../services/notifications";
import type { Notification, NotificationFilters } from "../types/notification";

// ─────────────────────────────────────────────
// Hook: fetch all notifications (with is_read filter)
// ─────────────────────────────────────────────
export function useNotifications(filters: NotificationFilters = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await notificationService.getAll(filters);
      setNotifications(result.data);
      setUnreadCount(result.unread_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, unreadCount, isLoading, error, refetch: fetchNotifications };
}

// ─────────────────────────────────────────────
// Hook: fetch only unread notifications (shorthand)
// ─────────────────────────────────────────────
export function useUnreadNotifications() {
  return useNotifications({ is_read: false });
}

// ─────────────────────────────────────────────
// Hook: mark single notification as read
// ─────────────────────────────────────────────
export function useMarkAsRead() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsRead = useCallback(
    async (id: number, onSuccess?: (data: Notification) => void) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await notificationService.markAsRead(id);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to mark as read";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { markAsRead, isLoading, error };
}

// ─────────────────────────────────────────────
// Hook: mark all notifications as read
// ─────────────────────────────────────────────
export function useMarkAllAsRead() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAllAsRead = useCallback(async (onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);
    try {
      await notificationService.markAllAsRead();
      onSuccess?.();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to mark all as read";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { markAllAsRead, isLoading, error };
}

// ─────────────────────────────────────────────
// Hook: delete notification
// ─────────────────────────────────────────────
export function useDeleteNotification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNotification = useCallback(
    async (id: number, onSuccess?: () => void) => {
      setIsLoading(true);
      setError(null);
      try {
        await notificationService.remove(id);
        onSuccess?.();
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete notification";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { deleteNotification, isLoading, error };
}