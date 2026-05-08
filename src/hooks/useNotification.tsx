// src/hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notifications";
import type { NotificationFilters } from "../types/notification";

// ─── Query Keys ──────────────────────────────
export const notificationKeys = {
  all: ["notifications"] as const,
  list: (filters: NotificationFilters) => ["notifications", "list", filters] as const,
  unread: ["notifications", "list", { is_read: false }] as const,
};

// ─── Fetch all notifications ─────────────────
export function useNotifications(filters: NotificationFilters = {}) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => notificationService.getAll(filters),
    staleTime: 2 * 60 * 1000, // notifikasi lebih sering berubah, fresh 2 menit
  });
}

// ─── Fetch unread only (shorthand) ───────────
export function useUnreadNotifications() {
  return useQuery({
    queryKey: notificationKeys.unread,
    queryFn: () => notificationService.getAll({ is_read: false }),
    staleTime: 60 * 1000, // unread lebih sensitif, fresh 1 menit
  });
}

// ─── Mark single as read ─────────────────────
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

// ─── Mark all as read ────────────────────────
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

// ─── Delete notification ─────────────────────
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}