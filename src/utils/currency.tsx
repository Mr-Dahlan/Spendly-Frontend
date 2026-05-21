import { currencies } from "../store/currencies";
import type { Currency } from "../types/currency";

const STORAGE_KEY = "user_currency";

export function getUserCurrency(): Currency {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return currencies[0]; // default IDR
  }

  try {
    return JSON.parse(saved);
  } catch {
    return currencies[0];
  }
}

export function setUserCurrency(currency: Currency) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currency));
}