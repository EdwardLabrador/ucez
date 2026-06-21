// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: es });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy 'a las' HH:mm", { locale: es });
}

export function formatCurrency(amount: number, currency = 'USD'): string {
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
  const colors: Record<string, { bg: string; text: string }> = {
    ACTIVE:    { bg: '#d1fae5', text: '#065f46' },
    PUBLISHED: { bg: '#d1fae5', text: '#065f46' },
    PAID:      { bg: '#d1fae5', text: '#065f46' },
    PENDING:   { bg: '#fef9c3', text: '#854d0e' },
    DRAFT:     { bg: '#f3f4f6', text: '#374151' },
    OVERDUE:   { bg: '#fee2e2', text: '#991b1b' },
    INACTIVE:  { bg: '#f3f4f6', text: '#6b7280' },
    SUSPENDED: { bg: '#ffedd5', text: '#9a3412' },
    CANCELLED: { bg: '#fee2e2', text: '#991b1b' },
    COMPLETED: { bg: '#dbeafe', text: '#1e40af' },
  };
  return JSON.stringify(colors[status] ?? { bg: '#f3f4f6', text: '#6b7280' });
}

export function parseStatusColor(status: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    ACTIVE:    { bg: '#d1fae5', text: '#065f46' },
    PUBLISHED: { bg: '#d1fae5', text: '#065f46' },
    PAID:      { bg: '#d1fae5', text: '#065f46' },
    PENDING:   { bg: '#fef9c3', text: '#854d0e' },
    DRAFT:     { bg: '#f3f4f6', text: '#374151' },
    OVERDUE:   { bg: '#fee2e2', text: '#991b1b' },
    INACTIVE:  { bg: '#f3f4f6', text: '#6b7280' },
    SUSPENDED: { bg: '#ffedd5', text: '#9a3412' },
    CANCELLED: { bg: '#fee2e2', text: '#991b1b' },
    COMPLETED: { bg: '#dbeafe', text: '#1e40af' },
  };
  return colors[status] ?? { bg: '#f3f4f6', text: '#6b7280' };
}
