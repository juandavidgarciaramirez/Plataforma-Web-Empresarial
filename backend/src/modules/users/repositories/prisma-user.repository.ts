import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { UserEntity, UserStatus } from '../entities/user.entity';
import { UserRepository } from './user.repository.interface';

/**
 * Implementación real sobre `security.users` (Etapa 2, jud_platform_dev).
 *
 * Adaptaciones respecto al esquema real (sección 6 del encargo: "si el
 * modelo actual tiene nombres diferentes, adaptar el repository/service"):
 * - `UserEntity.name` (un solo campo) se compone/descompone aquí desde las
 *   columnas reales `first_name` + `last_name`. El resto de la app (DTOs,
 *   AuthService, frontend) sigue usando `name` sin cambios.
 * - `UserEntity.id`/`roleId` son la representación en string del `bigint`
 *   real (`id.toString()`), no un UUID — es el mismo patrón que ya usan
 *   los JWT (`sub`) y el resto de entidades de este backend.
 * - `security.users.status` tiene 4 valores reales (ACTIVE/INACTIVE/
 *   BLOCKED/PENDING_VERIFICATION); `UserEntity.status` solo modela 2
 *   (ACTIVE/INACTIVE). Se colapsa BLOCKED/PENDING_VERIFICATION -> INACTIVE
 *   al leer (falla cerrado: ninguno de los dos puede iniciar sesión) y
 *   nunca se escribe otro valor que no sea ACTIVE/INACTIVE desde la app.
 *   Ampliar `UserStatus` a los 4 valores reales queda como mejora futura.
 * - `delete()` es un soft-delete real (`deleted_at = now()`, `status =
 *   INACTIVE`) porque la tabla ya tiene la columna para eso — no se borra
 *   la fila.
 */
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserEntity[]> {
    const rows = await this.prisma.users.findMany({
      where: { deleted_at: null },
      orderBy: { id: 'asc' },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    const row = await this.prisma.users.findFirst({
      where: { id: bigintId, deleted_at: null },
    });
    return row ? this.toEntity(row) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const row = await this.prisma.users.findFirst({
      where: { email: { equals: email, mode: 'insensitive' }, deleted_at: null },
    });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
    const { firstName, lastName } = this.splitName(data.name);

    const row = await this.prisma.users.create({
      data: {
        role_id: this.requireBigInt(data.roleId, 'roleId'),
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        phone: data.phone,
        password_hash: data.passwordHash,
        status: data.status,
        email_verified: true,
        last_login_at: data.lastLogin,
      },
    });

    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<UserEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    const nameFields =
      data.name !== undefined
        ? (() => {
            const { firstName, lastName } = this.splitName(data.name!);
            return { first_name: firstName, last_name: lastName };
          })()
        : {};

    try {
      const row = await this.prisma.users.update({
        where: { id: bigintId },
        data: {
          ...nameFields,
          ...(data.email !== undefined && { email: data.email }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.passwordHash !== undefined && { password_hash: data.passwordHash }),
          ...(data.roleId !== undefined && { role_id: this.requireBigInt(data.roleId, 'roleId') }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.lastLogin !== undefined && { last_login_at: data.lastLogin }),
          updated_at: new Date(),
        },
      });
      return this.toEntity(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return false;

    try {
      await this.prisma.users.update({
        where: { id: bigintId },
        data: { deleted_at: new Date(), status: 'INACTIVE' },
      });
      return true;
    } catch {
      return false;
    }
  }

  count(): Promise<number> {
    return this.prisma.users.count({ where: { deleted_at: null } });
  }

  private toEntity(row: {
    id: bigint;
    role_id: bigint;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    password_hash: string;
    status: string;
    last_login_at: Date | null;
    created_at: Date;
    updated_at: Date;
  }): UserEntity {
    const entity = new UserEntity();
    entity.id = row.id.toString();
    entity.name = `${row.first_name} ${row.last_name}`.trim();
    entity.email = row.email;
    entity.phone = row.phone;
    entity.passwordHash = row.password_hash;
    entity.roleId = row.role_id.toString();
    entity.status = this.toAppStatus(row.status);
    entity.lastLogin = row.last_login_at;
    entity.createdAt = row.created_at;
    entity.updatedAt = row.updated_at;
    return entity;
  }

  /** ACTIVE se conserva; cualquier otro estado real (BLOCKED/PENDING_VERIFICATION) falla cerrado como INACTIVE. */
  private toAppStatus(dbStatus: string): UserStatus {
    return dbStatus === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
  }

  private splitName(fullName: string): { firstName: string; lastName: string } {
    const trimmed = fullName.trim();
    const spaceIndex = trimmed.indexOf(' ');
    if (spaceIndex === -1) {
      // Sin apellido separable: `last_name` es NOT NULL en la base real, se
      // reutiliza el mismo nombre en vez de inventar un apellido.
      return { firstName: trimmed, lastName: trimmed };
    }
    return {
      firstName: trimmed.slice(0, spaceIndex),
      lastName: trimmed.slice(spaceIndex + 1),
    };
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }

  private requireBigInt(id: string, field: string): bigint {
    const value = this.toBigInt(id);
    if (value === null) {
      throw new Error(`Valor inválido para ${field}: "${id}" no es un id numérico`);
    }
    return value;
  }
}
