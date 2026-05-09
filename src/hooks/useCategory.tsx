// src/hooks/useCategory.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/categories";
import type {
  Category,
  CategoryFilters,
  CategoryType,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/category";

// ─── Query Keys ──────────────────────────────
export const categoryKeys = {
  all: ["categories"] as const,
  list: (filters: CategoryFilters) => ["categories", "list", filters] as const,
  byType: (type: CategoryType) => ["categories", "list", { type }] as const,
  detail: (id: number) => ["categories", "detail", id] as const,
};

// ─── Fetch all categories ─────────────────────
export function useCategories(filters: CategoryFilters = {}) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: () => categoryService.getAll(filters),
    staleTime: 10 * 60 * 1000,
  });

  return {
    categories: data?.data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

// ─── Fetch by type (shorthand) ────────────────
export function useCategoriesByType(type: CategoryType | undefined) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: type ? categoryKeys.byType(type) : categoryKeys.list({}),
    queryFn: () => categoryService.getAll(type ? { type } : {}),
    staleTime: 10 * 60 * 1000,
  });

  return {
    categories: data?.data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

// ─── Fetch single category ────────────────────
export function useCategoryById(id: number | null) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: categoryKeys.detail(id!),
    queryFn: () => categoryService.getById(id!),
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

// ─── Create category ──────────────────────────
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });

  return {
    createCategory: mutateAsync,
    isLoading: isPending,
    error,
  };
}

// ─── Update category ──────────────────────────
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryPayload }) =>
      categoryService.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
    },
  });

  return {
    updateCategory: mutateAsync,
    isLoading: isPending,
    error,
  };
}

// ─── Delete category ──────────────────────────
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: number) => categoryService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });

  return {
    deleteCategory: mutateAsync,
    isLoading: isPending,
    error,
  };
}