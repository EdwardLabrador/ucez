// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { cn, getStatusColor, getStatusLabel } from '@/lib/utils';

type BadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(status), className)}>
      {getStatusLabel(status)}
    </span>
  );
}

type PlanBadgeProps = {
  plan: string;
  className?: string;
};

const planColors: Record<string, string> = {
  BASIC: 'bg-gray-100 text-gray-700',
  STANDARD: 'bg-blue-100 text-blue-700',
  PREMIUM: 'bg-purple-100 text-purple-700',
  ENTERPRISE: 'bg-amber-100 text-amber-700',
};

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', planColors[plan] ?? 'bg-gray-100 text-gray-700', className)}>
      {getStatusLabel(plan)}
    </span>
  );
}
