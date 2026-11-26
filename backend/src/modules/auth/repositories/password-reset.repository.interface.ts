export interface PasswordResetToken {
  token: string;
  userId: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

/**
 * Contrato de persistencia de tokens de recuperación de contraseña.
 * Implementación temporal en memoria; se reemplaza por PostgreSQL sin
 * tocar `AuthService` (secciones 5/45 del brief).
 */
export interface PasswordResetRepository {
  create(data: { token: string; userId: string; expiresAt: Date }): Promise<PasswordResetToken>;
  findByToken(token: string): Promise<PasswordResetToken | null>;
  markUsed(token: string): Promise<void>;
  invalidateAllForUser(userId: string): Promise<void>;
}

export const PASSWORD_RESET_REPOSITORY = 'PASSWORD_RESET_REPOSITORY';
