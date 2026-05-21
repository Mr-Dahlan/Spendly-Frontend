import { getUserCurrency } from "./currency";

export function formatCurrency(amount: number) {
  const currency = getUserCurrency();

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(amount);
}