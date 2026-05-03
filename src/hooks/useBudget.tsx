import { useState, useEffect, useCallback } from "react";
import { budgetService } from "../services/budgets";
import type {
  Budget,
  BudgetFilters,
  BudgetStatus,
  CreateBudgetPayload,
  UpdateBudgetPayload,
} from "../types/budget";

// ─────────────────────────────────────────────
// Hook: fetch all budgets (with filters)
// ─────────────────────────────────────────────
export function useBudgets(filters: BudgetFilters = {}) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await budgetService.getAll(filters);
      setBudgets(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch budgets");
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // Derived: budgets yang sudah exceeded
  const exceededBudgets = budgets.filter((b) => b.usage.is_exceeded);

  // Derived: budgets yang dalam status warning
  const warningBudgets = budgets.filter(
    (b) => !b.usage.is_exceeded && b.usage.is_warning !== "false" && b.usage.is_warning !== ""
  );

  return { budgets, exceededBudgets, warningBudgets, isLoading, error, refetch: fetchBudgets };
}

// ─────────────────────────────────────────────
// Hook: fetch budgets by status (shorthand)
// ─────────────────────────────────────────────
export function useBudgetsByStatus(status: BudgetStatus | undefined) {
  return useBudgets(status ? { status } : {});
}

// ─────────────────────────────────────────────
// Hook: fetch single budget by ID
// ─────────────────────────────────────────────
export function useBudgetById(id: number | null) {
  const [data, setData] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudget = useCallback(async () => {
    if (id === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await budgetService.getById(id);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch budget");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  return { data, isLoading, error, refetch: fetchBudget };
}

// ─────────────────────────────────────────────
// Hook: create budget
// ─────────────────────────────────────────────
export function useCreateBudget() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const createBudget = useCallback(
    async (
      payload: CreateBudgetPayload,
      onSuccess?: (data: Budget) => void
    ) => {
      setIsLoading(true);
      setError(null);
      setMessage(null);
      try {
        const result = await budgetService.create(payload);
        setMessage(result.message);
        onSuccess?.(result.data);
        return result.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create budget";
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { createBudget, isLoading, error, message };
}

// ─────────────────────────────────────────────
// Hook: update budget
// ─────────────────────────────────────────────
export function useUpdateBudget() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const updateBudget = useCallback(
    async (
      id: number,
      payload: UpdateBudgetPayload,
      onSuccess?: (data: Budget) => void
    ) => {
      setIsLoading(true);
      setError(null);
      setMessage(null);
      try {
        const result = await budgetService.update(id, payload);
        setMessage(result.message);
        onSuccess?.(result.data);
        return result.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update budget";
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { updateBudget, isLoading, error, message };
}

// ─────────────────────────────────────────────
// Hook: delete budget
// ─────────────────────────────────────────────
export function useDeleteBudget() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBudget = useCallback(
    async (id: number, onSuccess?: () => void) => {
      setIsLoading(true);
      setError(null);
      try {
        await budgetService.remove(id);
        onSuccess?.();
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete budget";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { deleteBudget, isLoading, error };
}