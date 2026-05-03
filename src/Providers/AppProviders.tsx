// src/providers/AppProviders.tsx
import { AuthProvider } from "../context/AuthContext";
import { UserProvider } from "../context/UserContext";
// import { TransactionProvider } from "../context/TransactionContext";
// import { BudgetProvider } from "../context/BudgetContext";
import type { ReactNode } from "react";

// Susun dari luar ke dalam sesuai dependency
const providers = [
  AuthProvider,
  UserProvider,
//   TransactionProvider,
//   BudgetProvider,
];

export function AppProviders({ children }: { children: ReactNode }) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}