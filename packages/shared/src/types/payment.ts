// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';

export type PaymentMethod = 'CASH' | 'TRANSFER' | 'DEPOSIT' | 'CARD' | 'CHECK' | 'OTHER';

export type PaymentFrequency = 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL';

export type Payment = {
  id: string;
  affiliateId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  reference?: string;
  period: string;
  dueDate: Date;
  paidAt?: Date;
  notes?: string;
  receiptUrl?: string;
  receiptNumber: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AccountStatement = {
  affiliateId: string;
  businessName: string;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  payments: Payment[];
};
