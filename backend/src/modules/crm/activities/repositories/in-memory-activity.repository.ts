import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ActivityEntity } from '../entities/activity.entity';
import { ActivityRepository } from './activity.repository.interface';

/** Implementación TEMPORAL en memoria de `ActivityRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryActivityRepository implements ActivityRepository {
  private readonly items = new Map<string, ActivityEntity>();

  async findAll(): Promise<ActivityEntity[]> {
    return [...this.items.values()].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
  }

  async findById(id: string): Promise<ActivityEntity | null> {
    return this.items.get(id) ?? null;
  }

  async create(data: Omit<ActivityEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActivityEntity> {
    const now = new Date();
    const entity: ActivityEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<ActivityEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ActivityEntity | null> {
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
