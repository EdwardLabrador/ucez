// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'AFFILIATE';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  affiliateId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};
