import axiosInstance from "../lib/axios";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoryFilters,
  GetAllCategoriesResponse,
} from "../types/category";

export const categoryService = {
  /** GET /categories?type=income|expense */
  getAll: async (filters: CategoryFilters = {}): Promise<GetAllCategoriesResponse> => {
    const { data } = await axiosInstance.get<GetAllCategoriesResponse>("/categories", {
      params: filters,
    });
    return data;
  },

  /** GET /categories/:id */
  getById: async (id: number): Promise<Category> => {
    const { data } = await axiosInstance.get<Category>(`/categories/${id}`);
    return data;
  },

  /** POST /categories */
  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const { data } = await axiosInstance.post<Category>("/categories", payload);
    return data;
  },

  /** PUT /categories/:id */
  update: async (id: number, payload: UpdateCategoryPayload): Promise<Category> => {
    const { data } = await axiosInstance.put<Category>(`/categories/${id}`, payload);
    return data;
  },

  /** DELETE /categories/:id */
  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
};