import axiosInstance from "../lib/axios";
import type {
  CreateBudgetPayload,
  UpdateBudgetPayload,
  BudgetFilters,
  BudgetMutationResponse,
  GetAllBudgetsResponse,
  GetBudgetByIdResponse,
} from "../types/budget";

export const budgetService = {
  getAll: async (filters: BudgetFilters = {}): Promise<GetAllBudgetsResponse> => {
    const { data } = await axiosInstance.get<GetAllBudgetsResponse>("/budgets", {
      params: filters,
    });
    return data;
  },

  getById: async (id: number): Promise<GetBudgetByIdResponse> => {
    const { data } = await axiosInstance.get<GetBudgetByIdResponse>(`/budgets/${id}`);
    return data;
  },

  create: async (payload: CreateBudgetPayload): Promise<BudgetMutationResponse> => {
    const { data } = await axiosInstance.post<BudgetMutationResponse>("/budgets", payload);
    return data;
  },

  update: async (id: number, payload: UpdateBudgetPayload): Promise<BudgetMutationResponse> => {
    const { data } = await axiosInstance.patch<BudgetMutationResponse>(`/budgets/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/budgets/${id}`);
  },
};