import { useState, useEffect, useCallback } from "react";
import { transactionService } from "../services/transactions";
import type{
  Transaction,
  TransactionSummary,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  TransactionFilters,
} from "../types/transaction";

// ─────────────────────────────────────────────
// Hook: fetch all transactions (with filters)
// ─────────────────────────────────────────────
export function useTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await transactionService.getAll(filters);
      setTransactions(result.data);
      setSummary(result.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, summary, isLoading, error, refetch: fetchTransactions };
}

// ─────────────────────────────────────────────
// Hook: fetch single transaction by ID
// ─────────────────────────────────────────────
export function useTransactionById(id: number | null) {
  const [data, setData] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = useCallback(async () => {
    if (id === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await transactionService.getById(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transaction");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  return { data, isLoading, error, refetch: fetchTransaction };
}

// ─────────────────────────────────────────────
// Hook: create transaction
// ─────────────────────────────────────────────
export function useCreateTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = useCallback(
    async (
      payload: CreateTransactionPayload,
      onSuccess?: (data: Transaction) => void
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await transactionService.create(payload);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create transaction";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { createTransaction, isLoading, error };
}

// ─────────────────────────────────────────────
// Hook: update transaction
// ─────────────────────────────────────────────
export function useUpdateTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTransaction = useCallback(
    async (
      id: number,
      payload: UpdateTransactionPayload,
      onSuccess?: (data: Transaction) => void
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await transactionService.update(id, payload);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update transaction";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { updateTransaction, isLoading, error };
}

// ─────────────────────────────────────────────
// Hook: delete transaction
// ─────────────────────────────────────────────
export function useDeleteTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTransaction = useCallback(
    async (id: number, onSuccess?: () => void) => {
      setIsLoading(true);
      setError(null);
      try {
        await transactionService.remove(id);
        onSuccess?.();
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete transaction";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { deleteTransaction, isLoading, error };
}