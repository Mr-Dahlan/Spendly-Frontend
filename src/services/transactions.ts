import axiosInstance from "../lib/axios";
import type {
  Transaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  TransactionFilters,
  GetAllTransactionsResponse,
} from "../types/transaction.ts";

export const transactionService = {
  /** GET /transactions */
  getAll: async (filters: TransactionFilters = {}): Promise<GetAllTransactionsResponse> => {
    const { data } = await axiosInstance.get<GetAllTransactionsResponse>("/transactions", {
      params: filters,
    });
    return data;
  },

  /** GET /transactions/:id */
  getById: async (id: number): Promise<Transaction> => {
    const { data } = await axiosInstance.get<Transaction>(`/transactions/${id}`);
    return data;
  },

  /** POST /transactions */
  create: async (payload: CreateTransactionPayload): Promise<Transaction> => {
    const { data } = await axiosInstance.post<Transaction>("/transactions", payload);
    return data;
  },

  /** PUT /transactions/:id */
  update: async (id: number, payload: UpdateTransactionPayload): Promise<Transaction> => {
    const { data } = await axiosInstance.patch<Transaction>(`/transactions/${id}`, payload);
    return data;
  },

  /** DELETE /transactions/:id */
  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/transactions/${id}`);
  },
};