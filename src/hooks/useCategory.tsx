// src/hooks/useCategories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/categories";
import type {
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
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: () => categoryService.getAll(filters),
    staleTime: 10 * 60 * 1000, // kategori jarang berubah, fresh 10 menit
  });
}

// ─── Fetch by type (shorthand) ────────────────
export function useCategoriesByType(type: CategoryType | undefined) {
  return useQuery({
    queryKey: type ? categoryKeys.byType(type) : categoryKeys.list({}),
    queryFn: () => categoryService.getAll(type ? { type } : {}),
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Fetch single category ────────────────────
export function useCategoryById(id: number | null) {
  return useQuery({
    queryKey: categoryKeys.detail(id!),
    queryFn: () => categoryService.getById(id!),
    enabled: id !== null,
  });
}

// ─── Create category ──────────────────────────
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

// ─── Update category ──────────────────────────
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryPayload }) =>
      categoryService.update(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
    },
  });
}

// ─── Delete category ──────────────────────────
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}