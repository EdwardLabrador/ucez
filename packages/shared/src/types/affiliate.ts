// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

export type MembershipStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

export type MembershipPlan = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';

export type Affiliate = {
  id: string;
  businessName: string;
  tradeName?: string;
  ruc: string;
  sector: string;
  category?: string;
  membershipStatus: MembershipStatus;
  membershipPlan: MembershipPlan;
  membershipStartDate: Date;
  membershipEndDate?: Date;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  representativeName: string;
  representativeEmail: string;
  representativePhone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AffiliateContact = {
  id: string;
  affiliateId: string;
  name: string;
  position: string;
  email: string;
  phone?: string;
  isPrimary: boolean;
};
