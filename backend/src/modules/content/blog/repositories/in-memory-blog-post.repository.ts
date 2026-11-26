import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BlogPostEntity } from '../entities/blog-post.entity';
import { BlogPostRepository } from './blog-post.repository.interface';

/** Implementación TEMPORAL en memoria de `BlogPostRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryBlogPostRepository implements BlogPostRepository {
  private readonly items = new Map<string, BlogPostEntity>();

  async findAll(): Promise<BlogPostEntity[]> {
    return [...this.items.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<BlogPostEntity | null> {
    return this.items.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<BlogPostEntity | null> {
    return [...this.items.values()].find((p) => p.slug === slug) ?? null;
  }

  async create(data: Omit<BlogPostEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPostEntity> {
    const now = new Date();
    const entity: BlogPostEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<BlogPostEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<BlogPostEntity | null> {
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
