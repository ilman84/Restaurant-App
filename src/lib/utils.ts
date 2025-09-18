import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formats number to Indonesian Rupiah with dot separators and "Rp." prefix
export function formatRupiah(value: number | string): string {
  const num = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(num as number)) return 'Rp.0';
  try {
    const formatted = new Intl.NumberFormat('id-ID').format(num as number);
    return `Rp.${formatted}`;
  } catch {
    return `Rp.${String(value)}`;
  }
}
