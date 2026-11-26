import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from './user.repository.interface';

/**
 * Implementación TEMPORAL en memoria de `UserRepository`.
 * Se puebla desde `SeedService` al arrancar la aplicación (usuario
 * SUPER_ADMIN de pruebas). NO toca PostgreSQL.
 */
@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly items = new Map<string, UserEntity>();

  async findAll(): Promise<UserEntity[]> {
    return [...this.items.values()].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.items.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const normalized = email.toLowerCase().trim();
    return [...this.items.values()].find((u) => u.email.toLowerCase() === normalized) ?? null;
  }

  async create(data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
    const now = new Date();
    const entity: UserEntity = {
      id: randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<UserEntity | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async count(): Promise<number> {
    return this.items.size;
  }
}
