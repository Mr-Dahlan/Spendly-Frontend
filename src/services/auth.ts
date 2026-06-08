import axios from "../lib/axios";
import type { AuthResponse } from "../types/auth";

export const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
  const res = await axios.post("/register", {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });

  return res.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await axios.post("/login", {
    email,
    password,
  });

  const data = res.data;

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return {
    token: data.access_token,
    user: data.data,
  }
};

export const loginWithGoogle = async (accessToken: string): Promise<AuthResponse> => {
  const res = await axios.post("/auth/google", {
    access_token: accessToken,
  });
  const data = res.data;

  // Simpan token (pilih salah satu key yang konsisten)
  const token = data.access_token ?? data.token;
  if (token) {
    localStorage.setItem("token", token);
  }

  return {
    token: token,
    user: data.user ?? data.data, // fallback jika strukturnya beda
  };
};


export const logout = async () => {
  await axios.post("/logout");
  localStorage.removeItem("token");
};

export const getMe = async (token?: string) => {
  const authToken = token || localStorage.getItem("token");

  const res = await axios.get("/me", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return res.data;
};