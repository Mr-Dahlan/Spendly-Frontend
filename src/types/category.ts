export type CategoryType = "income" | "expense" | string;

export interface Category {
  category_id: number;
  user_id: number;
  nama: string;
  type: CategoryType;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface GetAllCategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface CreateCategoryPayload {
  user_id: number;
  nama: string;
  type: CategoryType;
  icon: string;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

export interface CategoryFilters {
  type?: CategoryType;
}