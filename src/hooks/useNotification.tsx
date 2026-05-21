  // src/hooks/useNotification.ts
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
    const { data, isLoading, isError, error, refetch } = useQuery({
      queryKey: notificationKeys.list(filters),
      queryFn: () => notificationService.getAll(filters),
      staleTime: 2 * 60 * 1000,
    });

    return {
      notifications: data?.data ?? [],
      unreadCount: data?.unread_count ?? 0,
      isLoading,
      isError,
      error,
      refetch,
    };
  }

  // ─── Fetch unread only (shorthand) ───────────
  export function useUnreadNotifications() {
    const { data, isLoading, isError, error, refetch } = useQuery({
      queryKey: notificationKeys.unread,
      queryFn: () => notificationService.getAll({ is_read: false }),
      staleTime: 60 * 1000,
    });

    return {
      notifications: data?.data ?? [],
      unreadCount: data?.unread_count ?? 0,
      isLoading,
      isError,
      error,
      refetch,
    };
  }

  // ─── Mark single as read ─────────────────────
  export function useMarkAsRead() {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending, error } = useMutation({
      mutationFn: (id: number) => notificationService.markAsRead(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      },
    });

    return {
      markAsRead: mutateAsync,
      isLoading: isPending,
      error,
    };
  }

  // ─── Mark all as read ────────────────────────
  export function useMarkAllAsRead() {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending, error } = useMutation({
      mutationFn: () => notificationService.markAllAsRead(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      },
    });

    return {
      markAllAsRead: mutateAsync,
      isLoading: isPending,
      error,
    };
  }

  // ─── Delete notification ─────────────────────
  export function useDeleteNotification() {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending, error } = useMutation({
      mutationFn: (id: number) => notificationService.remove(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      },
    });

    return {
      deleteNotification: mutateAsync,
      isLoading: isPending,
      error,
    };
  }