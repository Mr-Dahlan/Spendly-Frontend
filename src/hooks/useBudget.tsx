// src/hooks/useBudget.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "../services/budgets";
import type {
  BudgetFilters,
  BudgetStatus,
  // BudgetPeriod,
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
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: budgetKeys.list(filters),
    queryFn: () => budgetService.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });

  const budgets = data?.data ?? [];
  const exceededBudgets = budgets.filter((b) => b.usage.is_exceeded);
  const warningBudgets = budgets.filter(
    (b) => !b.usage.is_exceeded && Boolean(b.usage.is_warning) && b.usage.is_warning !== false
  );

  return {
    budgets,
    exceededBudgets,
    warningBudgets,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// ─── Fetch by status (shorthand) ──────────────
export function useBudgetsByStatus(status: BudgetStatus | undefined) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: status ? budgetKeys.byStatus(status) : budgetKeys.list({}),
    queryFn: () => budgetService.getAll(status ? { status } : {}),
    staleTime: 5 * 60 * 1000,
  });

  const budgets = data?.data ?? [];
  const exceededBudgets = budgets.filter((b) => b.usage.is_exceeded);
  const warningBudgets = budgets.filter(
    (b) => !b.usage.is_exceeded && Boolean(b.usage.is_warning) && b.usage.is_warning !== false
  );

  return {
    budgets,
    exceededBudgets,
    warningBudgets,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// ─── Fetch single budget ──────────────────────
export function useBudgetById(id: number | null) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: budgetKeys.detail(id!),
    queryFn: () => budgetService.getById(id!),
    enabled: id !== null,
  });

  return {
    data: data?.data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// ─── Create budget ────────────────────────────
export function useCreateBudget() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: CreateBudgetPayload) =>
      budgetService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });

  return {
    createBudget: mutateAsync,
    isLoading: isPending,
    error,
  };
}

// ─── Update budget ────────────────────────────
export function useUpdateBudget() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBudgetPayload }) =>
      budgetService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(id) });
    },
  });

  return {
    updateBudget: mutateAsync,
    isLoading: isPending,
    error,
  };
}

// ─── Delete budget ────────────────────────────
export function useDeleteBudget() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: number) => budgetService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });

  return {
    deleteBudget: mutateAsync,
    isLoading: isPending,
    error,
  };
}