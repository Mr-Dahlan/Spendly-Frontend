export type User = {
  id: number;
  name: string;
  email: string;
  status:boolean;
  role:"user" | "admin";
  mode: "light" | "dark";
};

// export type LoginResponseRaw = {
//   access_token: string;
//   token_type: string;
//   data: User;
// };

export type AuthResponse = {
  token: string;
  user: User;
};
