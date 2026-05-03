import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { User, UpdateUserPayload, AdminUpdateUserPayload } from "../types/users";
import UserService from "../services/users";
import { getMe } from "../services/auth"; // getMe tetap dari authService

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
  deleteUser: (id: number) => Promise<void>;

  clearError: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const UserContext = createContext<UserContextType | null>(null);

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
      throw err; // re-throw agar komponen bisa handle juga
    } finally {
      setIsLoading(false);
    }
  };

  // ── Fetch profil sendiri ──────────────────────────────────────────────────
  const fetchMe = useCallback(async () => {
    await withLoading(async () => {
      const res = await getMe(); // return res.data (raw)
      setCurrentUser(res.data);  // sesuaikan kalau struktur API-nya beda
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
    const res = await UserService.getUserById(id);
    return res;
  }, []);

  // ── Admin update user ─────────────────────────────────────────────────────
  const adminUpdateUser = useCallback(
    async (id: number, payload: AdminUpdateUserPayload) => {
      await withLoading(async () => {
        const updated = await UserService.adminUpdateUser(id, payload);
        // Update list kalau ada
        setUsers((prev) =>
          prev.map((u) => (u.user_id === updated.user_id ? updated : u))
        );
      });
    },
    []
  );

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