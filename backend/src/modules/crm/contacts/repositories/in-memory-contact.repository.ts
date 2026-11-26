import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ContactEntity } from '../entities/contact.entity';
import { ContactRepository } from './contact.repository.interface';

/** Implementación TEMPORAL en memoria de `ContactRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryContactRepository implements ContactRepository {
  private readonly items = new Map<string, ContactEntity>();

  async findAll(): Promise<ContactEntity[]> {
    return [...this.items.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<ContactEntity | null> {
    return this.items.get(id) ?? null;
  }

  async findByCompanyId(companyId: string): Promise<ContactEntity[]> {
    return [...this.items.values()].filter((c) => c.companyId === companyId);
  }

  async create(data: Omit<ContactEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactEntity> {
    const now = new Date();
    const entity: ContactEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<ContactEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ContactEntity | null> {
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
