import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { VacancyEntity } from '../entities/vacancy.entity';
import { VacancyRepository } from './vacancy.repository.interface';

/** Implementación TEMPORAL en memoria de `VacancyRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryVacancyRepository implements VacancyRepository {
  private readonly items = new Map<string, VacancyEntity>();

  async findAll(): Promise<VacancyEntity[]> {
    return [...this.items.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<VacancyEntity | null> {
    return this.items.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<VacancyEntity | null> {
    return [...this.items.values()].find((v) => v.slug === slug) ?? null;
  }

  async create(data: Omit<VacancyEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<VacancyEntity> {
    const now = new Date();
    const entity: VacancyEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<VacancyEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<VacancyEntity | null> {
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
