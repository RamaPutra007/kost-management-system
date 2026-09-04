import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Swal from 'sweetalert2';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return '0';
  return numericAmount.toLocaleString('id-ID', {
    maximumFractionDigits: 0,
  });
}

export const showAlert = {
  success: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#10b981', // emerald-500
      timer: 2000,
      showConfirmButton: false
    });
  },
  error: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#ef4444', // red-500
    });
  }
};
