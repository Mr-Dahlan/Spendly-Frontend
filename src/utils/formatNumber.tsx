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
 * Digunakan untuk input realtime — support desimal dengan koma
 * contoh:
 * "1000000"  -> "1.000.000"
 * "1500,5"   -> "1.500,5"
 * "1500,50"  -> "1.500,50"
 */
export const formatInputNumber = (value: string | number): string => {
  if (value === null || value === undefined) return "";

  const str = String(value);

  // Pisahkan bagian integer dan desimal (koma sebagai pemisah desimal)
  const [intPart, ...decParts] = str.split(",");

  // Bersihkan bagian integer, hanya angka
  const cleanedInt = intPart.replace(/\D/g, "").replace(/^0+/, "") || "0";

  // Format ribuan pakai titik
  const formattedInt = cleanedInt.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Kalau ada bagian desimal, tempel kembali (max 2 digit)
  if (decParts.length > 0) {
    const decPart = decParts.join("").replace(/\D/g, "").slice(0, 2);
    return `${formattedInt},${decPart}`;
  }

  return formattedInt;
};

/**
 * Mengubah format kembali ke angka mentah — support desimal
 * contoh:
 * "1.500.000"  -> 1500000
 * "1.500,50"   -> 1500.50
 */
export const parseInputNumber = (value: string): number => {
  if (!value) return 0;

  // Hapus titik ribuan, ganti koma desimal ke titik
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(normalized);

  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format persen
 * contoh: 12.5 -> 12.5%
 */
export const formatPercent = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format compact
 * contoh:
 * 1200    -> 1,2 rb
 * 1200000 -> 1,2 jt
 */
export const formatCompact = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
};