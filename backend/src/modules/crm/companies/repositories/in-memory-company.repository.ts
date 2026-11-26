import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CompanyEntity } from '../entities/company.entity';
import { CompanyRepository } from './company.repository.interface';

/** Implementación TEMPORAL en memoria de `CompanyRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryCompanyRepository implements CompanyRepository {
  private readonly items = new Map<string, CompanyEntity>();

  async findAll(): Promise<CompanyEntity[]> {
    return [...this.items.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<CompanyEntity | null> {
    return this.items.get(id) ?? null;
  }

  async create(data: Omit<CompanyEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyEntity> {
    const now = new Date();
    const entity: CompanyEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<CompanyEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<CompanyEntity | null> {
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
