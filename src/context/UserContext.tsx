import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { User, UpdateUserPayload, AdminUpdateUserPayload } from "../types/users";
import UserService from "../services/users";
import { getMe } from "../services/auth";

// ─── Shape Context ────────────────────────────────────────────────────────────
interface UserContextType {
  // State
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  error: string | null;

  // Actions - User
  fetchMe: () => Promise<void>;
  updateMe: (payload: UpdateUserPayload) => Promise<void>;

  // Actions - Admin
  fetchAllUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<User>;
  adminUpdateUser: (id: number, payload: AdminUpdateUserPayload) => Promise<void>;
  updateUserStatus: (id: number, status: boolean) => Promise<void>;
  updateUserRole: (id: number, role: User["role"]) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  clearError: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
export const UserContext = createContext<UserContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withLoading = async (fn: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);
    try {
      await fn();
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? "Terjadi kesalahan.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper untuk update user di list
  const updateUserInList = (updated: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.user_id === updated.user_id ? updated : u))
    );
  };

  // ── Fetch profil sendiri ──────────────────────────────────────────────────
  const fetchMe = useCallback(async () => {
    await withLoading(async () => {
      const res = await getMe();
      setCurrentUser(res.data);
    });
  }, []);

  // ── Update profil sendiri ─────────────────────────────────────────────────
  const updateMe = useCallback(async (payload: UpdateUserPayload) => {
    await withLoading(async () => {
      const updated = await UserService.updateMe(payload);
      setCurrentUser(updated);
    });
  }, []);

  // ── Fetch semua user (admin) ──────────────────────────────────────────────
  const fetchAllUsers = useCallback(async () => {
    await withLoading(async () => {
      const data = await UserService.getAllUsers();
      setUsers(data);
    });
  }, []);

  // ── Fetch user by ID (admin) ──────────────────────────────────────────────
  const fetchUserById = useCallback(async (id: number): Promise<User> => {
    return await UserService.getUserById(id);
  }, []);

  // ── Admin update user (general) ───────────────────────────────────────────
  const adminUpdateUser = useCallback(
    async (id: number, payload: AdminUpdateUserPayload) => {
      await withLoading(async () => {
        const updated = await UserService.adminUpdateUser(id, payload);
        updateUserInList(updated);
      });
    },
    []
  );

  // ── Update status user (admin) ────────────────────────────────────────────
  const updateUserStatus = useCallback(async (id: number, status: boolean) => {
    await withLoading(async () => {
      const updated = await UserService.updateUserStatus(id, status);
      updateUserInList(updated);
    });
  }, []);

  // ── Update role user (admin) ──────────────────────────────────────────────
  const updateUserRole = useCallback(async (id: number, role: User["role"]) => {
    await withLoading(async () => {
      const updated = await UserService.updateUserRole(id, role);
      updateUserInList(updated);
    });
  }, []);

  // ── Hapus user (admin) ────────────────────────────────────────────────────
  const deleteUser = useCallback(async (id: number) => {
    await withLoading(async () => {
      await UserService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.user_id !== id));
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        users,
        isLoading,
        error,
        fetchMe,
        updateMe,
        fetchAllUsers,
        fetchUserById,
        adminUpdateUser,
        updateUserStatus,
        updateUserRole,
        deleteUser,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser harus dipakai di dalam <UserProvider>");
  }
  return context;
}