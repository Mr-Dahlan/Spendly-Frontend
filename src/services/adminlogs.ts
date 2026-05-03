import axiosInstance from "../lib/axios";
import type {
  AdminLogFilters,
  AdminLogMutationResponse,
  CreateAdminLogPayload,
  GetAllAdminLogsResponse,
} from "../types/adminlog";

export const adminLogService = {
  /** GET /api/admin/logs — semua log (semua admin) */
  getAll: async (filters: AdminLogFilters = {}): Promise<GetAllAdminLogsResponse> => {
    const { data } = await axiosInstance.get<GetAllAdminLogsResponse>("/api/admin/logs", {
      params: filters,
    });
    return data;
  },

  /** GET /api/admin/logs/mine — log milik admin yang sedang login */
  getMine: async (filters: AdminLogFilters = {}): Promise<GetAllAdminLogsResponse> => {
    const { data } = await axiosInstance.get<GetAllAdminLogsResponse>("/api/admin/logs/mine", {
      params: filters,
    });
    return data;
  },

  /** POST /api/admin/logs — buat log secara manual */
  create: async (payload: CreateAdminLogPayload): Promise<AdminLogMutationResponse> => {
    const { data } = await axiosInstance.post<AdminLogMutationResponse>("/api/admin/logs", payload);
    return data;
  },
};