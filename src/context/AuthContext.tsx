// src/contexts/AuthContext.tsx
import { createContext, useEffect, useState } from "react";
import type { User } from "../types/auth";
import * as authService from "../services/auth";
import useThemeStore from "../store/themeStore"; // <-- import store

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: (accessToken: string) => Promise<User>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({} as User),
  loginWithGoogle: async () => ({} as User),
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const syncFromUser = useThemeStore((state) => state.syncFromUser); // <-- ambil action

  // 🔥 auto login
  useEffect(() => {
    if (initialized) return;

    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        const data = await authService.getMe();
        setUser(data);
        syncFromUser(data.mode); // <-- sync mode dari DB saat auto login
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    init();
  }, [initialized]);

  const login = async (email: string, password: string) => {
  const { token } = await authService.login(email, password);
  localStorage.setItem("token", token);

  const freshUser = await authService.getMe();
  setUser(freshUser);
  syncFromUser(freshUser.mode);
  return freshUser;
};

  const loginWithGoogle = async (accessToken: string) => {
  const { token } = await authService.loginWithGoogle(accessToken);
  localStorage.setItem("token", token);

  // Ambil data user yang fresh dari /me, bukan dari response login
  const freshUser = await authService.getMe();
  setUser(freshUser);
  syncFromUser(freshUser.mode);
  return freshUser;
};

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    await authService.register(name, email, password, passwordConfirmation);
    await login(email, password);
    // console.log("User registered and logged in");
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login,loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};