// src/hooks/useTransaction.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services/transactions";
import type {
  CreateTransactionPayload,
  UpdateTransactionPayload,
  TransactionFilters,
} from "../types/transaction";

// ─── Query Keys (centralized) ───────────────
export const transactionKeys = {
  all: ["transactions"] as const,
  list: (filters: TransactionFilters) => ["transactions", "list", filters] as const,
  detail: (id: number) => ["transactions", "detail", id] as const,
};

// ─── Fetch all transactions ──────────────────
export function useTransactions(filters: TransactionFilters = {}) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionService.getAll(filters),
  });

  return {
    transactions: data?.data ?? [],
    summary: data?.summary ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// ─── Fetch single transaction ────────────────
export function useTransactionById(id: number | null) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: transactionKeys.detail(id!),
    queryFn: () => transactionService.getById(id!),
    enabled: id !== null,
  });

  return {
    data: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// ─── Create transaction ──────────────────────
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });

  return {
    createTransaction: mutateAsync,
    isLoading: isPending,
    error,
  };
}

// ─── Update transaction ──────────────────────
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTransactionPayload }) =>
      transactionService.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
    },
  });

  return {
    updateTransaction: mutateAsync,
    isLoading: isPending,
    error,
  };
}

// ─── Delete transaction ──────────────────────
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: number) => transactionService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });

  return {
    deleteTransaction: mutateAsync,
    isLoading: isPending,
    error,
  };
}