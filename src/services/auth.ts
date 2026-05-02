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

export const logout = async () => {
  await axios.post("/logout");
  localStorage.removeItem("token");
};

export const getMe = async () => {
  // const token = localStorage.getItem("token");
  // console.log("TOKEN SAAT /ME:", token);

  const res = await axios.get("/me");

  return res.data;
};
