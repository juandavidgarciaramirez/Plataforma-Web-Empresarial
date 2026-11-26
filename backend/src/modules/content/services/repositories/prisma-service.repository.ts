import { Injectable } from '@nestjs/common';
import { PrismaService as Prisma } from '../../../../database/prisma/prisma.service';
import { ServiceEntity } from '../entities/service.entity';
import { ServiceRepository } from './service.repository.interface';
import { ContentStatus } from '../../common/content.types';

type ServiceRow = {
  id: bigint;
  code: string;
  name: string;
  short_description: string | null;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  image_url: string | null;
  image_alt: string | null;
  created_at: Date;
  updated_at: Date;
};

/**
 * Implementación real sobre `catalog.services` (Etapa 5). Las 5 filas
 * reales de Capital Consulting se agregaron en
 * `database/migrations/004_content_catalog.sql`; las 7 de plantilla
 * genérica ("Consultoría Empresarial", etc.) quedaron con `is_active=false`
 * y no las devuelve este repositorio salvo que se pidan explícitamente por
 * id — evita que aparezcan como servicios reales en el sitio público.
 */
@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
  constructor(private readonly prisma: Prisma) {}

  async findAll(): Promise<ServiceEntity[]> {
    const rows = await this.prisma.services.findMany({ orderBy: { sort_order: 'asc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.services.findUnique({ where: { id: bigintId } });
    return row ? this.toEntity(row) : null;
  }

  async findBySlug(slug: string): Promise<ServiceEntity | null> {
    const row = await this.prisma.services.findUnique({ where: { code: slug } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceEntity> {
    const row = await this.prisma.services.create({
      data: {
        code: data.slug,
        name: data.name,
        short_description: data.shortDescription,
        description: data.description,
        icon: data.icon,
        sort_order: data.order,
        is_active: data.status === 'PUBLISHED',
        image_url: data.imageUrl ?? null,
        image_alt: data.imageAlt ?? null,
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ServiceEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const row = await this.prisma.services.update({
        where: { id: bigintId },
        data: {
          ...(data.slug !== undefined && { code: data.slug }),
          ...(data.name !== undefined && { name: data.name }),
          ...(data.shortDescription !== undefined && { short_description: data.shortDescription }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.icon !== undefined && { icon: data.icon }),
          ...(data.order !== undefined && { sort_order: data.order }),
          ...(data.status !== undefined && { is_active: data.status === 'PUBLISHED' }),
          ...(data.imageUrl !== undefined && { image_url: data.imageUrl }),
          ...(data.imageAlt !== undefined && { image_alt: data.imageAlt }),
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
      // Soft delete real: la tabla no tiene `deleted_at` -> se usa `is_active=false`.
      await this.prisma.services.update({ where: { id: bigintId }, data: { is_active: false } });
      return true;
    } catch {
      return false;
    }
  }

  private toEntity(row: ServiceRow): ServiceEntity {
    const entity = new ServiceEntity();
    entity.id = row.id.toString();
    entity.slug = row.code;
    entity.name = row.name;
    entity.shortDescription = row.short_description ?? '';
    entity.description = row.description ?? '';
    entity.icon = row.icon;
    entity.order = row.sort_order;
    entity.status = this.toStatus(row.is_active);
    entity.imageUrl = row.image_url;
    entity.imageAlt = row.image_alt;
    entity.createdAt = row.created_at;
    entity.updatedAt = row.updated_at;
    return entity;
  }

  private toStatus(isActive: boolean): ContentStatus {
    return isActive ? 'PUBLISHED' : 'DRAFT';
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }
}
