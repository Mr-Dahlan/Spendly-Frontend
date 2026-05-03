import axiosInstance from "../lib/axios";
import type {
  Budget,
  CreateBudgetPayload,
  UpdateBudgetPayload,
  BudgetFilters,
  BudgetMutationResponse,
  GetAllBudgetsResponse,
  GetBudgetByIdResponse,
} from "../types/budget";

export const budgetService = {
  /** GET /budgets */
  getAll: async (filters: BudgetFilters = {}): Promise<GetAllBudgetsResponse> => {
    const { data } = await axiosInstance.get<GetAllBudgetsResponse>("/budgets", {
      params: filters,
    });
    return data;
  },

  /** GET /budgets/:id */
  getById: async (id: number): Promise<GetBudgetByIdResponse> => {
    const { data } = await axiosInstance.get<GetBudgetByIdResponse>(`/budgets/${id}`);
    return data;
  },

  /** POST /budgets */
  create: async (payload: CreateBudgetPayload): Promise<BudgetMutationResponse> => {
    const { data } = await axiosInstance.post<BudgetMutationResponse>("/budgets", payload);
    return data;
  },

  /** PUT /budgets/:id */
  update: async (id: number, payload: UpdateBudgetPayload): Promise<BudgetMutationResponse> => {
    const { data } = await axiosInstance.put<BudgetMutationResponse>(`/budgets/${id}`, payload);
    return data;
  },

  /** DELETE /budgets/:id */
  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/budgets/${id}`);
  },
};