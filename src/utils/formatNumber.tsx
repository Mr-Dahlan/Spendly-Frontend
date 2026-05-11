// src/utils/formatNumber.ts

/**
 * Format currency IDR
 * contoh: 10000 -> Rp10.000
 */
export const formatIDR = (
  value: number | string,
  withPrefix = true
): string => {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("id-ID", {
    style: withPrefix ? "currency" : "decimal",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

/**
 * Format angka biasa
 * contoh: 1000000 -> 1.000.000
 */
export const formatNumber = (value: number | string): string => {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(number);
};

/**
 * Digunakan untuk input realtime
 * contoh:
 * "1000000" -> "1.000.000"
 */
export const formatInputNumber = (
  value: string | number
): string => {
  if (value === null || value === undefined) return "";
  
  const cleaned = String(value).replace(/\D/g, "");
  if (cleaned === "") return "";
  
  // Hapus leading zeros
  const number = cleaned.replace(/^0+/, "") || "0";
  
  // Format manual pakai regex, lebih reliable dari toLocaleString
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
/**
 * Mengubah format kembali ke angka mentah
 * contoh:
 * "1.000.000" -> "1000000"
 */
export const parseInputNumber = (
  value: string
): number => {
  if (!value) return 0;

  return Number(value.replace(/\D/g, ""));
};

/**
 * Format persen
 * contoh: 12.5 -> 12.5%
 */
export const formatPercent = (
  value: number,
  decimals = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format compact
 * contoh:
 * 1200 -> 1,2 rb
 * 1200000 -> 1,2 jt
 */
export const formatCompact = (
  value: number
): string => {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
};