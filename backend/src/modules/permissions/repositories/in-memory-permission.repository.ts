import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PermissionEntity } from '../entities/permission.entity';
import { PermissionRepository } from './permission.repository.interface';
import { PERMISSION_KEYS, PERMISSION_MODULES } from '../permissions.constants';

/**
 * Implementación TEMPORAL en memoria de `PermissionRepository`.
 * Se precarga con el catálogo fijo de permisos definido en la Fase 5.
 * NO toca PostgreSQL — los datos viven en memoria del proceso Node.
 */
@Injectable()
export class InMemoryPermissionRepository implements PermissionRepository {
  private readonly items = new Map<string, PermissionEntity>();

  constructor() {
    const now = new Date();
    for (const key of PERMISSION_KEYS) {
      const id = randomUUID();
      this.items.set(id, {
        id,
        key,
        module: PERMISSION_MODULES[key],
        description: `Permiso: ${key}`,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  async findAll(): Promise<PermissionEntity[]> {
    return [...this.items.values()].sort((a, b) => a.key.localeCompare(b.key));
  }

  async findById(id: string): Promise<PermissionEntity | null> {
    return this.items.get(id) ?? null;
  }

  async findByKey(key: string): Promise<PermissionEntity | null> {
    return [...this.items.values()].find((p) => p.key === key) ?? null;
  }

  async findByKeys(keys: string[]): Promise<PermissionEntity[]> {
    const set = new Set(keys);
    return [...this.items.values()].filter((p) => set.has(p.key));
  }

  async create(data: Pick<PermissionEntity, 'key' | 'module' | 'description'>): Promise<PermissionEntity> {
    const now = new Date();
    const entity: PermissionEntity = {
      id: randomUUID(),
      key: data.key,
      module: data.module,
      description: data.description,
      createdAt: now,
      updatedAt: now,
    };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Pick<PermissionEntity, 'module' | 'description'>>,
  ): Promise<PermissionEntity | null> {
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
