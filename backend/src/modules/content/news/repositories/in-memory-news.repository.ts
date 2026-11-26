import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NewsEntity } from '../entities/news.entity';
import { NewsRepository } from './news.repository.interface';

/** Implementación TEMPORAL en memoria de `NewsRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryNewsRepository implements NewsRepository {
  private readonly items = new Map<string, NewsEntity>();

  async findAll(): Promise<NewsEntity[]> {
    return [...this.items.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<NewsEntity | null> {
    return this.items.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<NewsEntity | null> {
    return [...this.items.values()].find((n) => n.slug === slug) ?? null;
  }

  async create(data: Omit<NewsEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsEntity> {
    const now = new Date();
    const entity: NewsEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<NewsEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<NewsEntity | null> {
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
