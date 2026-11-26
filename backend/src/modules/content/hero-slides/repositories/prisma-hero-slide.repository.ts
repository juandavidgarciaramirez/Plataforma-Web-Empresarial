import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../prisma/generated';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { HeroSlideEntity, HeroSlideItem } from '../entities/hero-slide.entity';
import { HeroSlideRepository } from './hero-slide.repository.interface';

type HeroSlideRow = {
  id: bigint;
  slug: string;
  service_code: string | null;
  name_white: string;
  name_blue: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_position: string | null;
  href: string;
  items: Prisma.JsonValue;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

/** Implementación real sobre `content.hero_slides` (Etapa 7, tabla nueva — no existía). */
@Injectable()
export class PrismaHeroSlideRepository implements HeroSlideRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<HeroSlideEntity[]> {
    const rows = await this.prisma.hero_slides.findMany({ orderBy: { sort_order: 'asc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<HeroSlideEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.hero_slides.findUnique({ where: { id: bigintId } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<HeroSlideEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeroSlideEntity> {
    const row = await this.prisma.hero_slides.create({
      data: {
        slug: data.slug,
        service_code: data.serviceCode,
        name_white: data.nameWhite,
        name_blue: data.nameBlue,
        title: data.title,
        description: data.description,
        image_url: data.imageUrl,
        image_position: data.imagePosition,
        href: data.href,
        items: (data.items ?? []) as unknown as Prisma.InputJsonValue,
        sort_order: data.order,
        is_active: data.isActive,
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<HeroSlideEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<HeroSlideEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const row = await this.prisma.hero_slides.update({
        where: { id: bigintId },
        data: {
          ...(data.slug !== undefined && { slug: data.slug }),
          ...(data.serviceCode !== undefined && { service_code: data.serviceCode }),
          ...(data.nameWhite !== undefined && { name_white: data.nameWhite }),
          ...(data.nameBlue !== undefined && { name_blue: data.nameBlue }),
          ...(data.title !== undefined && { title: data.title }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.imageUrl !== undefined && { image_url: data.imageUrl }),
          ...(data.imagePosition !== undefined && { image_position: data.imagePosition }),
          ...(data.href !== undefined && { href: data.href }),
          ...(data.items !== undefined && { items: data.items as unknown as Prisma.InputJsonValue }),
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
      await this.prisma.hero_slides.delete({ where: { id: bigintId } });
      return true;
    } catch {
      return false;
    }
  }

  private toEntity(row: HeroSlideRow): HeroSlideEntity {
    const entity = new HeroSlideEntity();
    entity.id = row.id.toString();
    entity.slug = row.slug;
    entity.serviceCode = row.service_code;
    entity.nameWhite = row.name_white;
    entity.nameBlue = row.name_blue;
    entity.title = row.title;
    entity.description = row.description;
    entity.imageUrl = row.image_url;
    entity.imagePosition = row.image_position;
    entity.href = row.href;
    entity.items = this.toItems(row.items);
    entity.order = row.sort_order;
    entity.isActive = row.is_active;
    entity.createdAt = row.created_at;
    entity.updatedAt = row.updated_at;
    return entity;
  }

  private toItems(value: Prisma.JsonValue): HeroSlideItem[] {
    if (!Array.isArray(value)) return [];
    const items: HeroSlideItem[] = [];
    for (const v of value) {
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        const obj = v as Record<string, unknown>;
        items.push({ label: String(obj.label ?? ''), icon: String(obj.icon ?? '') });
      }
    }
    return items;
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }
}
