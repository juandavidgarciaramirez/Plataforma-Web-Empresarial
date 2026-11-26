import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { PermissionEntity } from '../entities/permission.entity';
import { PermissionRepository } from './permission.repository.interface';

type PermissionRow = {
  id: bigint;
  module: string;
  permission_key: string;
  description: string | null;
  created_at: Date | null;
};

/**
 * Implementación real sobre `security.permissions` (Etapa 2, jud_platform_dev).
 * La tabla real separa `module`/`resource`/`action` además de la columna
 * `permission_key` ya compuesta; `resource`/`action` se derivan de la clave
 * al crear (formato `modulo.recurso.accion`, ver CreatePermissionDto). No
 * existe columna `updated_at` real -> se expone `created_at` en su lugar.
 */
@Injectable()
export class PrismaPermissionRepository implements PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PermissionEntity[]> {
    const rows = await this.prisma.permissions.findMany({ orderBy: { permission_key: 'asc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<PermissionEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.permissions.findUnique({ where: { id: bigintId } });
    return row ? this.toEntity(row) : null;
  }

  async findByKey(key: string): Promise<PermissionEntity | null> {
    const row = await this.prisma.permissions.findUnique({ where: { permission_key: key } });
    return row ? this.toEntity(row) : null;
  }

  async findByKeys(keys: string[]): Promise<PermissionEntity[]> {
    if (keys.length === 0) return [];
    const rows = await this.prisma.permissions.findMany({ where: { permission_key: { in: keys } } });
    return rows.map((row) => this.toEntity(row));
  }

  async create(data: Pick<PermissionEntity, 'key' | 'module' | 'description'>): Promise<PermissionEntity> {
    const [module, resource, action] = data.key.split('.');

    const row = await this.prisma.permissions.create({
      data: {
        module: data.module || module,
        resource: resource ?? data.key,
        action: action ?? 'read',
        permission_key: data.key,
        description: data.description,
      },
    });

    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Pick<PermissionEntity, 'module' | 'description'>>,
  ): Promise<PermissionEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const row = await this.prisma.permissions.update({
        where: { id: bigintId },
        data: {
          ...(data.module !== undefined && { module: data.module }),
          ...(data.description !== undefined && { description: data.description }),
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
      // `role_permissions` cae en cascada (FK ON DELETE CASCADE) — al
      // borrar un permiso se destraban automáticamente sus asignaciones.
      await this.prisma.permissions.delete({ where: { id: bigintId } });
      return true;
    } catch {
      return false;
    }
  }

  private toEntity(row: PermissionRow): PermissionEntity {
    const entity = new PermissionEntity();
    entity.id = row.id.toString();
    entity.key = row.permission_key;
    entity.module = row.module;
    entity.description = row.description ?? '';
    entity.createdAt = row.created_at ?? new Date(0);
    entity.updatedAt = row.created_at ?? new Date(0);
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
