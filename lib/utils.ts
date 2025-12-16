import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts a rating value to a number
 * Handles string, null, undefined, and NaN cases
 */
export function safeRating(rating: any): number {
  const num = typeof rating === 'string' ? parseFloat(rating) : rating;
  if (isNaN(num) || num === null || num === undefined) {
    return 0;
  }
  // Clamp between 0 and 5
  return Math.max(0, Math.min(5, num));
}

/**
 * Formats a rating for display
 */
export function formatRating(rating: any, decimals: number = 1): string {
  const safeNum = safeRating(rating);
  return safeNum > 0 ? safeNum.toFixed(decimals) : "Baru";
}

/**
 * Formats an amount into Rupiah currency string.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Memformat angka menjadi string dengan pemisah ribuan (titik) TANPA simbol mata uang.
 */
export function formatNumberWithSeparator(
  amount: number | string | null | undefined,
): string {
  if (amount === null || amount === undefined || amount === 0 || amount === '0' || amount === '') return '';
  
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d]/g, '')) : amount;
  if (isNaN(num)) return '';

  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Membersihkan string input berformat menjadi nilai numerik murni dalam bentuk string.
 */
export function parseNumberFromFormattedString(
  formattedString: string,
): string {
  if (!formattedString) return '';

  const cleanedString = formattedString.replace(/[^\d]/g, '');

  if (cleanedString === '' || cleanedString === '0') return '';

  return parseInt(cleanedString, 10).toString();
}

/**
 * Maps bank/e-wallet name to its corresponding logo URL/path.
 * NOTE: Anda harus memastikan file logo ini ada di folder /public/logos/
 * @param bankName The name of the bank or e-wallet.
 * @returns The path to the logo image.
 */
export function getBankLogoUrl(bankName: string): string {
  if (!bankName) return '/logos/generic-bank.svg';
  const normalizedName = bankName.toUpperCase().trim();

  // Mapping ke bank/e-wallet umum di Indonesia
  if (normalizedName.includes('BCA')) return '/logos/bca.svg';
  if (normalizedName.includes('MANDIRI')) return '/logos/mandiri.svg';
  if (normalizedName.includes('BRI')) return '/logos/bri.svg';
  if (normalizedName.includes('BNI')) return '/logos/bni.svg';
  if (normalizedName.includes('DANA')) return '/logos/dana.svg';
  if (normalizedName.includes('GOPAY') || normalizedName.includes('GO-PAY')) return '/logos/gopay.svg';
  if (normalizedName.includes('OVO')) return '/logos/ovo.svg';
  if (normalizedName.includes('LINKAJA')) return '/logos/linkaja.svg';

  // Fallback
  return '/logos/generic-bank.svg'; 
}