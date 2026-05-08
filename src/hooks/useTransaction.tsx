// src/hooks/useTransactions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services/transactions";
import type {
  Transaction,
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
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionService.getAll(filters),
    // Data di-cache per kombinasi filter!
    // Pindah halaman → balik lagi → TIDAK fetch ulang selama masih fresh
  });
}

// ─── Fetch single transaction ────────────────
export function useTransactionById(id: number | null) {
  return useQuery({
    queryKey: transactionKeys.detail(id!),
    queryFn: () => transactionService.getById(id!),
    enabled: id !== null, // hanya fetch kalau id ada
  });
}

// ─── Create transaction ──────────────────────
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionService.create(payload),
    onSuccess: () => {
      // Otomatis invalidate cache → list akan refetch
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

// ─── Update transaction ──────────────────────
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTransactionPayload }) =>
      transactionService.update(id, payload),
    onSuccess: (data, { id }) => {
      // Invalidate list + detail yang bersangkutan
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
    },
  });
}

// ─── Delete transaction ──────────────────────
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => transactionService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}