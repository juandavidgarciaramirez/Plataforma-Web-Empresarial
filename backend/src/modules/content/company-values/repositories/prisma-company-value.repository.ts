import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { CompanyValueEntity } from '../entities/company-value.entity';
import { CompanyValueRepository } from './company-value.repository.interface';

type CompanyValueRow = {
  id: bigint;
  key: string;
  title: string;
  description: string | null;
  icon_key: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

/** Implementación real sobre `content.company_values` (Etapa 7, tabla nueva — no existía). */
@Injectable()
export class PrismaCompanyValueRepository implements CompanyValueRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CompanyValueEntity[]> {
    const rows = await this.prisma.company_values.findMany({ orderBy: { sort_order: 'asc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<CompanyValueEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.company_values.findUnique({ where: { id: bigintId } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<CompanyValueEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyValueEntity> {
    const row = await this.prisma.company_values.create({
      data: {
        key: data.key,
        title: data.title,
        description: data.description,
        icon_key: data.iconKey,
        image_url: data.imageUrl,
        sort_order: data.order,
        is_active: data.isActive,
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<CompanyValueEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<CompanyValueEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const row = await this.prisma.company_values.update({
        where: { id: bigintId },
        data: {
          ...(data.key !== undefined && { key: data.key }),
          ...(data.title !== undefined && { title: data.title }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.iconKey !== undefined && { icon_key: data.iconKey }),
          ...(data.imageUrl !== undefined && { image_url: data.imageUrl }),
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
      await this.prisma.company_values.delete({ where: { id: bigintId } });
      return true;
    } catch {
      return false;
    }
  }

  private toEntity(row: CompanyValueRow): CompanyValueEntity {
    const entity = new CompanyValueEntity();
    entity.id = row.id.toString();
    entity.key = row.key;
    entity.title = row.title;
    entity.description = row.description;
    entity.iconKey = row.icon_key;
    entity.imageUrl = row.image_url;
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
