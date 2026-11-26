import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TeamMemberEntity } from '../entities/team-member.entity';
import { TeamMemberRepository } from './team-member.repository.interface';

/** Implementación TEMPORAL en memoria de `TeamMemberRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryTeamMemberRepository implements TeamMemberRepository {
  private readonly items = new Map<string, TeamMemberEntity>();

  async findAll(): Promise<TeamMemberEntity[]> {
    return [...this.items.values()].sort((a, b) => a.order - b.order);
  }

  async findById(id: string): Promise<TeamMemberEntity | null> {
    return this.items.get(id) ?? null;
  }

  async create(data: Omit<TeamMemberEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMemberEntity> {
    const now = new Date();
    const entity: TeamMemberEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<TeamMemberEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<TeamMemberEntity | null> {
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
