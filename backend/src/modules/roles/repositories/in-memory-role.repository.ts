import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RoleEntity } from '../entities/role.entity';
import { RoleRepository } from './role.repository.interface';
import { DEFAULT_ROLE_PERMISSIONS, ROLE_DESCRIPTIONS, ROLE_NAMES } from '../roles.constants';

/**
 * Implementación TEMPORAL en memoria de `RoleRepository`.
 * Precargada con los 7 roles iniciales (Fase 4) y sus permisos por defecto.
 * NO toca PostgreSQL.
 */
@Injectable()
export class InMemoryRoleRepository implements RoleRepository {
  private readonly items = new Map<string, RoleEntity>();

  constructor() {
    const now = new Date();
    for (const name of ROLE_NAMES) {
      const id = randomUUID();
      this.items.set(id, {
        id,
        name,
        description: ROLE_DESCRIPTIONS[name],
        permissionKeys: [...DEFAULT_ROLE_PERMISSIONS[name]],
        isSystem: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  async findAll(): Promise<RoleEntity[]> {
    return [...this.items.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<RoleEntity | null> {
    return this.items.get(id) ?? null;
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    return [...this.items.values()].find((r) => r.name === name) ?? null;
  }

  async create(
    data: Pick<RoleEntity, 'name' | 'description' | 'permissionKeys'> & { isSystem?: boolean },
  ): Promise<RoleEntity> {
    const now = new Date();
    const entity: RoleEntity = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      permissionKeys: data.permissionKeys,
      isSystem: data.isSystem ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Pick<RoleEntity, 'description' | 'permissionKeys'>>,
  ): Promise<RoleEntity | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}
