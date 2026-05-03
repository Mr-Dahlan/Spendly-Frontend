import { useState, useEffect, useCallback } from "react";
import { categoryService } from "../services/categories";
import type {
  Category,
  CategoryFilters,
  CategoryType,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/category";

// ─────────────────────────────────────────────
// Hook: fetch all categories (with type filter)
// ─────────────────────────────────────────────
export function useCategories(filters: CategoryFilters = {}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await categoryService.getAll(filters);
      setCategories(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch: fetchCategories };
}

// ─────────────────────────────────────────────
// Hook: fetch categories by type (shorthand)
// ─────────────────────────────────────────────
export function useCategoriesByType(type: CategoryType | undefined) {
  return useCategories(type ? { type } : {});
}

// ─────────────────────────────────────────────
// Hook: fetch single category by ID
// ─────────────────────────────────────────────
export function useCategoryById(id: number | null) {
  const [data, setData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    if (id === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await categoryService.getById(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch category");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return { data, isLoading, error, refetch: fetchCategory };
}

// ─────────────────────────────────────────────
// Hook: create category
// ─────────────────────────────────────────────
export function useCreateCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = useCallback(
    async (
      payload: CreateCategoryPayload,
      onSuccess?: (data: Category) => void
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await categoryService.create(payload);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create category";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { createCategory, isLoading, error };
}

// ─────────────────────────────────────────────
// Hook: update category
// ─────────────────────────────────────────────
export function useUpdateCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCategory = useCallback(
    async (
      id: number,
      payload: UpdateCategoryPayload,
      onSuccess?: (data: Category) => void
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await categoryService.update(id, payload);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update category";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { updateCategory, isLoading, error };
}

// ─────────────────────────────────────────────
// Hook: delete category
// ─────────────────────────────────────────────
export function useDeleteCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCategory = useCallback(
    async (id: number, onSuccess?: () => void) => {
      setIsLoading(true);
      setError(null);
      try {
        await categoryService.remove(id);
        onSuccess?.();
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete category";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { deleteCategory, isLoading, error };
}