// src/context/LenisContext.tsx
import { createContext, useContext } from "react";
import type { RefObject } from "react";
import type Lenis from "lenis";

export const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

export function useLenisInstance() {
  return useContext(LenisContext);
}