import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { RoleEntity } from '../entities/role.entity';
import { RoleRepository } from './role.repository.interface';

type RoleRow = {
  id: bigint;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at: Date;
  updated_at: Date;
  role_permissions: { permissions: { permission_key: string } }[];
};

/**
 * Implementación real sobre `security.roles` (Etapa 2, jud_platform_dev).
 * `RoleEntity.permissionKeys` se resuelve/persiste vía la tabla puente
 * `security.role_permissions` — la app sigue viendo un simple `string[]`.
 */
@Injectable()
export class PrismaRoleRepository implements RoleRepository {
  private readonly include = {
    role_permissions: { include: { permissions: { select: { permission_key: true } } } },
  } as const;

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<RoleEntity[]> {
    const rows = await this.prisma.roles.findMany({
      include: this.include,
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<RoleEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.roles.findUnique({ where: { id: bigintId }, include: this.include });
    return row ? this.toEntity(row) : null;
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const row = await this.prisma.roles.findUnique({ where: { name }, include: this.include });
    return row ? this.toEntity(row) : null;
  }

  async create(
    data: Pick<RoleEntity, 'name' | 'description' | 'permissionKeys'> & { isSystem?: boolean },
  ): Promise<RoleEntity> {
    const created = await this.prisma.$transaction(async (tx) => {
      const role = await tx.roles.create({
        data: {
          name: data.name,
          description: data.description,
          is_system: data.isSystem ?? false,
        },
      });

      if (data.permissionKeys.length > 0) {
        const permissions = await tx.permissions.findMany({
          where: { permission_key: { in: data.permissionKeys } },
          select: { id: true },
        });
        await tx.role_permissions.createMany({
          data: permissions.map((p) => ({ role_id: role.id, permission_id: p.id })),
        });
      }

      return tx.roles.findUniqueOrThrow({ where: { id: role.id }, include: this.include });
    });

    return this.toEntity(created);
  }

  async update(
    id: string,
    data: Partial<Pick<RoleEntity, 'description' | 'permissionKeys'>>,
  ): Promise<RoleEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.roles.update({
          where: { id: bigintId },
          data: {
            ...(data.description !== undefined && { description: data.description }),
            updated_at: new Date(),
          },
        });

        if (data.permissionKeys !== undefined) {
          await tx.role_permissions.deleteMany({ where: { role_id: bigintId } });

          if (data.permissionKeys.length > 0) {
            const permissions = await tx.permissions.findMany({
              where: { permission_key: { in: data.permissionKeys } },
              select: { id: true },
            });
            await tx.role_permissions.createMany({
              data: permissions.map((p) => ({ role_id: bigintId, permission_id: p.id })),
            });
          }
        }

        return tx.roles.findUniqueOrThrow({ where: { id: bigintId }, include: this.include });
      });

      return this.toEntity(updated);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return false;

    try {
      // `role_permissions` cae en cascada (FK ON DELETE CASCADE); si algún
      // usuario real todavía tiene este role_id (FK ON DELETE NO ACTION),
      // Postgres rechaza el DELETE y se atrapa aquí devolviendo false.
      await this.prisma.roles.delete({ where: { id: bigintId } });
      return true;
    } catch {
      return false;
    }
  }

  private toEntity(row: RoleRow): RoleEntity {
    const entity = new RoleEntity();
    entity.id = row.id.toString();
    entity.name = row.name;
    entity.description = row.description ?? '';
    entity.permissionKeys = row.role_permissions.map((rp) => rp.permissions.permission_key);
    entity.isSystem = row.is_system;
    entity.createdAt = row.created_at;
    entity.updatedAt = row.updated_at;
    return entity;
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }
}
