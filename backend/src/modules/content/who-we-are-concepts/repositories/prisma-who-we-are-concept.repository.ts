import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { WhoWeAreConceptEntity } from '../entities/who-we-are-concept.entity';
import { WhoWeAreConceptRepository } from './who-we-are-concept.repository.interface';

type WhoWeAreConceptRow = {
  id: bigint;
  key: string;
  label: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

/** Implementación real sobre `content.who_we_are_concepts` (Etapa 7, tabla nueva — no existía). */
@Injectable()
export class PrismaWhoWeAreConceptRepository implements WhoWeAreConceptRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<WhoWeAreConceptEntity[]> {
    const rows = await this.prisma.who_we_are_concepts.findMany({ orderBy: { sort_order: 'asc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<WhoWeAreConceptEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.who_we_are_concepts.findUnique({ where: { id: bigintId } });
    return row ? this.toEntity(row) : null;
  }

  async create(
    data: Omit<WhoWeAreConceptEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WhoWeAreConceptEntity> {
    const row = await this.prisma.who_we_are_concepts.create({
      data: {
        key: data.key,
        label: data.label,
        description: data.description,
        sort_order: data.order,
        is_active: data.isActive,
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<WhoWeAreConceptEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<WhoWeAreConceptEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const row = await this.prisma.who_we_are_concepts.update({
        where: { id: bigintId },
        data: {
          ...(data.key !== undefined && { key: data.key }),
          ...(data.label !== undefined && { label: data.label }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.order !== undefined && { sort_order: data.order }),
          ...(data.isActive !== undefined && { is_active: data.isActive }),
          updated_at: new Date(),
        },
      });
      return this.toEntity(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return false;
    try {
      await this.prisma.who_we_are_concepts.delete({ where: { id: bigintId } });
      return true;
    } catch {
      return false;
    }
  }

  private toEntity(row: WhoWeAreConceptRow): WhoWeAreConceptEntity {
    const entity = new WhoWeAreConceptEntity();
    entity.id = row.id.toString();
    entity.key = row.key;
    entity.label = row.label;
    entity.description = row.description;
    entity.order = row.sort_order;
    entity.isActive = row.is_active;
    entity.createdAt = row.created_at;
    entity.updatedAt = row.updated_at;
    return entity;
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }
}
