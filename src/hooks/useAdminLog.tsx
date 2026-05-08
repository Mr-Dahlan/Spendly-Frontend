// src/hooks/useAdminLogs.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLogService } from "../services/adminlogs";
import type { AdminLogFilters, CreateAdminLogPayload } from "../types/adminlog";

// ─── Query Keys ──────────────────────────────
export const adminLogKeys = {
  all: ["adminLogs"] as const,
  list: (filters: AdminLogFilters) => ["adminLogs", "list", filters] as const,
  mine: (filters: AdminLogFilters) => ["adminLogs", "mine", filters] as const,
};

// ─── Fetch semua log (seluruh admin) ──────────
export function useAdminLogs(filters: AdminLogFilters = {}) {
  const query = useQuery({
    queryKey: adminLogKeys.list(filters),
    queryFn: () => adminLogService.getAll(filters),
    staleTime: 3 * 60 * 1000,
  });

  return {
    ...query,
    logs: query.data?.data ?? [],
    total: query.data?.total ?? 0,
  };
}

// ─── Fetch log milik admin yang login ─────────
export function useMyAdminLogs(filters: AdminLogFilters = {}) {
  const query = useQuery({
    queryKey: adminLogKeys.mine(filters),
    queryFn: () => adminLogService.getMine(filters),
    staleTime: 3 * 60 * 1000,
  });

  return {
    ...query,
    logs: query.data?.data ?? [],
    total: query.data?.total ?? 0,
  };
}

// ─── Create log manual ────────────────────────
export function useCreateAdminLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminLogPayload) =>
      adminLogService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminLogKeys.all });
    },
  });
}