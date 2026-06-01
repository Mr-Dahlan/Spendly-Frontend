import { getUserCurrency } from "./currency";

export function formatCurrency(amount: number) {
  const currency = getUserCurrency();
  
  // Cek apakah amount punya desimal
  const hasDecimal = amount % 1 !== 0;

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: hasDecimal ? 2 : 0,
  }).format(amount);
}