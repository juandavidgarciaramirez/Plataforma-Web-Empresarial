import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { OpportunityEntity } from '../entities/opportunity.entity';
import { OpportunityRepository } from './opportunity.repository.interface';

/** Implementación TEMPORAL en memoria de `OpportunityRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryOpportunityRepository implements OpportunityRepository {
  private readonly items = new Map<string, OpportunityEntity>();

  async findAll(): Promise<OpportunityEntity[]> {
    return [...this.items.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<OpportunityEntity | null> {
    return this.items.get(id) ?? null;
  }

  async create(data: Omit<OpportunityEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<OpportunityEntity> {
    const now = new Date();
    const entity: OpportunityEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<OpportunityEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<OpportunityEntity | null> {
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
