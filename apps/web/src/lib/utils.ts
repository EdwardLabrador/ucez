// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'dd/MM/yyyy', { locale: es });
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), "dd/MM/yyyy 'a las' HH:mm", { locale: es });
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('es-VE', { style: 'currency', currency }).format(amount);
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    SUSPENDED: 'Suspendido',
    PENDING: 'Pendiente',
    PAID: 'Pagado',
    OVERDUE: 'Vencido',
    CANCELLED: 'Cancelado',
    REFUNDED: 'Reembolsado',
    DRAFT: 'Borrador',
    PUBLISHED: 'Publicado',
    COMPLETED: 'Completado',
    BASIC: 'Básico',
    STANDARD: 'Estándar',
    PREMIUM: 'Premium',
    ENTERPRISE: 'Empresarial',
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    PUBLISHED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    DRAFT: 'bg-gray-100 text-gray-800',
    OVERDUE: 'bg-red-100 text-red-800',
    INACTIVE: 'bg-gray-100 text-gray-600',
    SUSPENDED: 'bg-orange-100 text-orange-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-600';
}
