import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { AuthRepository, RefreshSession } from './auth.repository.interface';

/**
 * Implementación real sobre `security.sessions` (Etapa 2, jud_platform_dev).
 *
 * La tabla real fue diseñada para guardar metadata rica de dispositivo/geo
 * por sesión. El `id` que maneja `AuthService` (el `jti` embebido en el JWT
 * de refresh) se guarda en la columna `refresh_token` (uuid) — es la
 * columna que la propia tabla ya destina a esto, en vez de sobrecargar
 * `uuid` (que aquí es solo un identificador interno con default de
 * Postgres, no tiene fin público como en roles/permissions/users).
 *
 * OJO: ni `uuid` ni `refresh_token` tienen UNIQUE real en la base (solo hay
 * un índice btree no-único en `refresh_token` — ver
 * database/audit/BASELINE.md). Colisión prácticamente imposible con UUIDs,
 * pero queda documentado como mejora futura (agregar `UNIQUE` real) — no se
 * asume ni se altera el esquema en esta etapa.
 *
 * `ip_address` es NOT NULL sin default -> si el llamador no la conoce se usa
 * un valor reservado ("0.0.0.0", RFC 5737/6890) en vez de fingir una IP real.
 */
@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  private static readonly UNKNOWN_IP = '0.0.0.0';

  constructor(private readonly prisma: PrismaService) {}

  async createSession(data: {
    id: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<RefreshSession> {
    const row = await this.prisma.sessions.create({
      data: {
        refresh_token: data.id,
        user_id: this.requireBigInt(data.userId),
        ip_address: data.ipAddress || PrismaAuthRepository.UNKNOWN_IP,
        user_agent: data.userAgent,
        expires_at: data.expiresAt,
      },
    });

    return this.toEntity(row);
  }

  async findSessionById(id: string): Promise<RefreshSession | null> {
    const row = await this.prisma.sessions.findFirst({ where: { refresh_token: id } });
    return row ? this.toEntity(row) : null;
  }

  async revokeSession(id: string): Promise<void> {
    await this.prisma.sessions.updateMany({
      where: { refresh_token: id, revoked_at: null },
      data: { revoked_at: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    const bigintId = this.toBigInt(userId);
    if (bigintId === null) return;

    await this.prisma.sessions.updateMany({
      where: { user_id: bigintId, revoked_at: null },
      data: { revoked_at: new Date() },
    });
  }

  private toEntity(row: {
    refresh_token: string;
    user_id: bigint;
    expires_at: Date;
    revoked_at: Date | null;
    created_at: Date;
  }): RefreshSession {
    return {
      id: row.refresh_token,
      userId: row.user_id.toString(),
      expiresAt: row.expires_at,
      revoked: row.revoked_at !== null,
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
      throw new Error(`userId inválido para sesión: "${id}"`);
    }
    return value;
  }
}
