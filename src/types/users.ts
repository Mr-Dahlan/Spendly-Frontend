// ─── Response dari API (tanpa password) ───────────────────────────────────────
export interface User {
  user_id: number;
  name: string;
  email: string;
  role: string;
  status: boolean;
  mode: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Untuk Update Profile (password opsional) ─────────────────────────────────
export interface UpdateUserPayload {
  name?: string;
  mode?: string;
  password?: string;
  password_confirmation?: string;
}

// ─── Untuk Admin update (role, status, dll) ───────────────────────────────────
export interface AdminUpdateUserPayload extends UpdateUserPayload {
  role?: string;
  status?: boolean;
}

// ─── Bentuk response API ──────────────────────────────────────────────────────
export interface UserResponse {
    message?: string;
    data?: User;
}

export interface UsersResponse {
  data: User[];
  message?: string;
}