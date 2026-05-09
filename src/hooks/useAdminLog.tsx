// src/hooks/useAdminLog.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLogService } from "../services/adminlogs";
import type {
  AdminLogFilters,
  CreateAdminLogPayload,
} from "../types/adminlog";

// ─── Query Keys ──────────────────────────────
export const adminLogKeys = {
  all: ["adminLogs"] as const,
  list: (filters: AdminLogFilters) => ["adminLogs", "list", filters] as const,
  mine: (filters: AdminLogFilters) => ["adminLogs", "mine", filters] as const,
};

// ─── Fetch semua log (seluruh admin) ──────────
export function useAdminLogs(filters: AdminLogFilters = {}) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: adminLogKeys.list(filters),
    queryFn: () => adminLogService.getAll(filters),
    staleTime: 3 * 60 * 1000,
  });

  return {
    logs: data?.data ?? [],       // AdminLog[]
    total: data?.total ?? 0,      // number
    isLoading,
    isError,
    error,
    refetch,
  };
}

// ─── Fetch log milik admin yang login ─────────
export function useMyAdminLogs(filters: AdminLogFilters = {}) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: adminLogKeys.mine(filters),
    queryFn: () => adminLogService.getMine(filters),
    staleTime: 3 * 60 * 1000,
  });

  return {
    logs: data?.data ?? [],       // AdminLog[]
    total: data?.total ?? 0,      // number
    isLoading,
    isError,
    error,
    refetch,
  };
}

// ─── Create log manual ────────────────────────
export function useCreateAdminLog() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: CreateAdminLogPayload) =>
      adminLogService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminLogKeys.all });
    },
  });

  return {
    createAdminLog: mutateAsync,  // return AdminLogMutationResponse { success, message, data }
    isLoading: isPending,
    error,
  };
}