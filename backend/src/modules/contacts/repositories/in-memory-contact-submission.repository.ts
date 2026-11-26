import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ContactSubmissionEntity } from '../entities/contact-submission.entity';
import { ContactSubmissionRepository } from './contact-submission.repository.interface';

/** Implementación TEMPORAL en memoria. NO toca PostgreSQL. */
@Injectable()
export class InMemoryContactSubmissionRepository implements ContactSubmissionRepository {
  private readonly items: ContactSubmissionEntity[] = [];

  async findAll(): Promise<ContactSubmissionEntity[]> {
    return [...this.items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async create(data: Omit<ContactSubmissionEntity, 'id' | 'createdAt'>): Promise<ContactSubmissionEntity> {
    const entity: ContactSubmissionEntity = { id: randomUUID(), ...data, createdAt: new Date() };
    this.items.push(entity);
    return entity;
  }

  async countRecent(days: number): Promise<number> {
    const since = Date.now() - days * 24 * 60 * 60 * 1000;
    return this.items.filter((c) => c.createdAt.getTime() >= since).length;
  }
}
