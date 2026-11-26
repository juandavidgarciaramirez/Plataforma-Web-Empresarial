export interface RefreshSession {
  id: string; // jti embebido en el refresh token JWT
  userId: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
}

/**
 * Contrato de persistencia de sesiones (refresh tokens). Implementación
 * temporal en memoria; se reemplaza por PostgreSQL sin tocar AuthService.
 */
export interface AuthRepository {
  createSession(data: {
    id: string;
    userId: string;
    expiresAt: Date;
    /** IP real del cliente (sección 24/43 del encargo). Opcional para no romper llamadores existentes. */
    ipAddress?: string;
    userAgent?: string;
  }): Promise<RefreshSession>;
  findSessionById(id: string): Promise<RefreshSession | null>;
  revokeSession(id: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';
