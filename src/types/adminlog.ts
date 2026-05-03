export interface AdminLog {
  log_id: number;
  admin_id: number;
  target_user_id: string;
  action: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface GetAllAdminLogsResponse {
  success: boolean;
  total: number;
  data: AdminLog[];
}

export interface AdminLogMutationResponse {
  success: boolean;
  message: string;
  data: AdminLog;
}

export interface AdminLogFilters {
  action?: string;
  admin_id?: string;
  date?: string;
  month?: string;
  target_user_id?: string;
  year?: string;
}

export interface CreateAdminLogPayload {
  target_user_id: string;
  action: string;
  description: string;
}