import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LeadEntity } from '../entities/lead.entity';
import { LeadRepository } from './lead.repository.interface';

/** Implementación TEMPORAL en memoria de `LeadRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryLeadRepository implements LeadRepository {
  private readonly items = new Map<string, LeadEntity>();

  async findAll(): Promise<LeadEntity[]> {
    return [...this.items.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<LeadEntity | null> {
    return this.items.get(id) ?? null;
  }

  async findByChatSessionId(chatSessionId: string): Promise<LeadEntity | null> {
    return [...this.items.values()].find((l) => l.chatSessionId === chatSessionId) ?? null;
  }

  async create(data: Omit<LeadEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeadEntity> {
    const now = new Date();
    const entity: LeadEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<LeadEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<LeadEntity | null> {
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
