import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TaskEntity } from '../entities/task.entity';
import { TaskRepository } from './task.repository.interface';

/** Implementación TEMPORAL en memoria de `TaskRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryTaskRepository implements TaskRepository {
  private readonly items = new Map<string, TaskEntity>();

  async findAll(): Promise<TaskEntity[]> {
    return [...this.items.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<TaskEntity | null> {
    return this.items.get(id) ?? null;
  }

  async create(data: Omit<TaskEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskEntity> {
    const now = new Date();
    const entity: TaskEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<TaskEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<TaskEntity | null> {
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
