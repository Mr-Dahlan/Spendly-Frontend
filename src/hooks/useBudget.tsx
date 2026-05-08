// src/hooks/useBudgets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "../services/budgets";
import type {
  BudgetFilters,
  BudgetStatus,
  CreateBudgetPayload,
  UpdateBudgetPayload,
} from "../types/budget";

// ─── Query Keys ──────────────────────────────
export const budgetKeys = {
  all: ["budgets"] as const,
  list: (filters: BudgetFilters) => ["budgets", "list", filters] as const,
  byStatus: (status: BudgetStatus) => ["budgets", "list", { status }] as const,
  detail: (id: number) => ["budgets", "detail", id] as const,
};

// ─── Fetch all budgets ────────────────────────
export function useBudgets(filters: BudgetFilters = {}) {
  const query = useQuery({
    queryKey: budgetKeys.list(filters),
    queryFn: () => budgetService.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });

  // Derived data — tetap ada seperti hook lama kamu
  const budgets = query.data?.data ?? [];
  const exceededBudgets = budgets.filter((b) => b.usage.is_exceeded);
  const warningBudgets = budgets.filter(
    (b) => !b.usage.is_exceeded && b.usage.is_warning !== "false" && b.usage.is_warning !== ""
  );

  return {
    ...query,         // isLoading, error, refetch, dll
    budgets,
    exceededBudgets,
    warningBudgets,
  };
}

// ─── Fetch by status (shorthand) ──────────────
export function useBudgetsByStatus(status: BudgetStatus | undefined) {
  return useQuery({
    queryKey: status ? budgetKeys.byStatus(status) : budgetKeys.list({}),
    queryFn: () => budgetService.getAll(status ? { status } : {}),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Fetch single budget ──────────────────────
export function useBudgetById(id: number | null) {
  return useQuery({
    queryKey: budgetKeys.detail(id!),
    queryFn: async () => {
      const result = await budgetService.getById(id!);
      return result.data; // unwrap langsung seperti hook lama
    },
    enabled: id !== null,
  });
}

// ─── Create budget ────────────────────────────
export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBudgetPayload) => budgetService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}

// ─── Update budget ────────────────────────────
export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBudgetPayload }) =>
      budgetService.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(id) });
    },
  });
}

// ─── Delete budget ────────────────────────────
export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => budgetService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}