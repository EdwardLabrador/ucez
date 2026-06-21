// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

export type ServiceCategory =
  | 'LEGAL'
  | 'FINANCIAL'
  | 'TRAINING'
  | 'NETWORKING'
  | 'CONSULTING'
  | 'BENEFITS'
  | 'OTHER';

export type ServiceStatus = 'ACTIVE' | 'INACTIVE';

export type Service = {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  status: ServiceStatus;
  imageUrl?: string;
  contactInfo?: string;
  externalLink?: string;
  availableForPlans: string[];
  createdAt: Date;
  updatedAt: Date;
};
