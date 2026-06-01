import axios from "../lib/axios";
import type {
  User,
  UserResponse,
  UsersResponse,
  UpdateUserPayload,
  AdminUpdateUserPayload,
} from "../types/users";

const UserService = {
    // ── Admin: Service ─────────────────────────────────────────────────────

  getAllUsers: async (): Promise<User[]> => {
    const res = await axios.get<UsersResponse>("/users");
    return res.data.data ?? [];          // fallback array kosong
  },

  getUserById: async (id: number): Promise<User> => {
    const res = await axios.get<UserResponse>(`/users/${id}`);
    if (!res.data.data) throw new Error("User not found");
    return res.data.data;
  },

  adminUpdateUser: async (id: number, payload: AdminUpdateUserPayload): Promise<User> => {
    const res = await axios.patch<UserResponse>(`/users/${id}`, payload);
    if (!res.data.data) throw new Error("Update failed");
    return res.data.data;
  },
  
  updateUserStatus: async (id: number, status: boolean): Promise<User> => {
  const res = await axios.patch<UserResponse>(`/admin/users/${id}/status`, { status });
  if (!res.data.data) throw new Error("Update failed");
  return res.data.data;
},

updateUserRole: async (id: number, role: User["role"]): Promise<User> => {
  const res = await axios.patch<UserResponse>(`/admin/users/${id}/role`, { role });
  if (!res.data.data) throw new Error("Update failed");
  return res.data.data;
},

  deleteUser: async (id: number, password: string): Promise<void> => {
  await axios.delete(`/users/${id}`, {
    data: { password }, // ← axios DELETE dengan body pakai `data`
  });
},

  // ── Users: Service ─────────────────────────────────────────────────────
    updateMe: async (payload: UpdateUserPayload): Promise<User> => {
    const res = await axios.patch<UserResponse>("/users/update-profile", payload);
    if (!res.data.data) throw new Error("Update failed");
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await axios.get<UserResponse>("/me");
    if (!res.data.data) throw new Error("User not found");
    return res.data.data;
  },

};

export default UserService;