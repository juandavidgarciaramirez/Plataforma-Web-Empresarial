import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { PasswordResetRepository, PasswordResetToken } from './password-reset.repository.interface';

/**
 * Implementación real sobre `security.password_resets` (Etapa 2).
 * La columna `token` es `uuid` nativo de Postgres -> `AuthService.forgotPassword`
 * genera el token con `randomUUID()` (antes generaba hex arbitrario, que no
 * era un uuid válido para esta columna).
 */
@Injectable()
export class PrismaPasswordResetRepository implements PasswordResetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { token: string; userId: string; expiresAt: Date }): Promise<PasswordResetToken> {
    const row = await this.prisma.password_resets.create({
      data: {
        token: data.token,
        user_id: this.requireBigInt(data.userId),
        expires_at: data.expiresAt,
      },
    });
    return this.toEntity(row);
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const row = await this.prisma.password_resets.findUnique({ where: { token } });
    return row ? this.toEntity(row) : null;
  }

  async markUsed(token: string): Promise<void> {
    await this.prisma.password_resets.updateMany({
      where: { token },
      data: { used_at: new Date() },
    });
  }

  async invalidateAllForUser(userId: string): Promise<void> {
    const bigintId = this.toBigInt(userId);
    if (bigintId === null) return;

    await this.prisma.password_resets.updateMany({
      where: { user_id: bigintId, used_at: null },
      data: { used_at: new Date() },
    });
  }

  private toEntity(row: {
    token: string;
    user_id: bigint;
    expires_at: Date;
    used_at: Date | null;
    created_at: Date;
  }): PasswordResetToken {
    return {
      token: row.token,
      userId: row.user_id.toString(),
      expiresAt: row.expires_at,
      usedAt: row.used_at,
      createdAt: row.created_at,
    };
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }

  private requireBigInt(id: string): bigint {
    const value = this.toBigInt(id);
    if (value === null) {
      throw new Error(`userId inválido para password reset: "${id}"`);
    }
    return value;
  }
}
