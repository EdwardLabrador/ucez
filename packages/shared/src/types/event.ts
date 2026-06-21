// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

export type EventType = 'CONFERENCE' | 'WORKSHOP' | 'MEETING' | 'WEBINAR' | 'SOCIAL' | 'OTHER';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

export type Event = {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  location?: string;
  isVirtual: boolean;
  virtualLink?: string;
  startDate: Date;
  endDate: Date;
  capacity?: number;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type EventRegistration = {
  id: string;
  eventId: string;
  affiliateId: string;
  registeredAt: Date;
  attended: boolean;
};
