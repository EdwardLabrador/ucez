// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

export type NotificationType =
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_REMINDER'
  | 'PAYMENT_OVERDUE'
  | 'EVENT_PUBLISHED'
  | 'EVENT_REMINDER'
  | 'SERVICE_PUBLISHED'
  | 'ANNOUNCEMENT'
  | 'MEMBERSHIP_EXPIRING'
  | 'SYSTEM';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'BOTH';

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  channel: NotificationChannel;
  referenceId?: string;
  referenceType?: string;
  createdAt: Date;
};
