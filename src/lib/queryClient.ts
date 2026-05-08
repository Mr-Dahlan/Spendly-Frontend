// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // data fresh selama 5 menit
      gcTime: 10 * 60 * 1000,     // cache hidup 10 menit di memori
      retry: 1,
      refetchOnWindowFocus: false, // matikan kalau tidak perlu
    },
  },
});