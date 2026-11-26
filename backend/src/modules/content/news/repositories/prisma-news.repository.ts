import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { NewsEntity } from '../entities/news.entity';
import { NewsRepository } from './news.repository.interface';
import {
  POST_INCLUDE,
  PostRow,
  readCategory,
  readContentBlocks,
  setPostCategory,
  toAppStatus,
  toBigIntOrNull,
} from '../../common/prisma-post.util';

/**
 * Implementación real sobre `content.posts` (Etapa 5), filtrando
 * `post_type = 'NEWS'` — mismo shape real que Blog, ver `PrismaBlogPostRepository`.
 */
@Injectable()
export class PrismaNewsRepository implements NewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<NewsEntity[]> {
    const rows = await this.prisma.posts.findMany({
      where: { post_type: 'NEWS' },
      include: POST_INCLUDE,
      orderBy: { created_at: 'desc' },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<NewsEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.posts.findFirst({ where: { id: bigintId, post_type: 'NEWS' }, include: POST_INCLUDE });
    return row ? this.toEntity(row) : null;
  }

  async findBySlug(slug: string): Promise<NewsEntity | null> {
    const row = await this.prisma.posts.findFirst({ where: { slug, post_type: 'NEWS' }, include: POST_INCLUDE });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<NewsEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsEntity> {
    const created = await this.prisma.posts.create({
      data: {
        post_type: 'NEWS',
        slug: data.slug,
        title: data.title,
        excerpt: data.summary,
        content: data.content,
        cover_image_url: data.coverImageUrl,
        featured_image_file_id: toBigIntOrNull(data.coverImageFileId),
        image_alt: data.imageAlt ?? null,
        status: data.status,
        published_at: data.publishedAt,
      },
    });
    await setPostCategory(this.prisma, created.id, data.category);
    return this.findById(created.id.toString()) as Promise<NewsEntity>;
  }

  async update(id: string, data: Partial<Omit<NewsEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<NewsEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      await this.prisma.posts.update({
        where: { id: bigintId },
        data: {
          ...(data.slug !== undefined && { slug: data.slug }),
          ...(data.title !== undefined && { title: data.title }),
          ...(data.summary !== undefined && { excerpt: data.summary }),
          ...(data.content !== undefined && { content: data.content }),
          ...(data.coverImageUrl !== undefined && { cover_image_url: data.coverImageUrl }),
          ...(data.coverImageFileId !== undefined && { featured_image_file_id: toBigIntOrNull(data.coverImageFileId) }),
          ...(data.imageAlt !== undefined && { image_alt: data.imageAlt }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.publishedAt !== undefined && { published_at: data.publishedAt }),
          updated_at: new Date(),
        },
      });
      if (data.category !== undefined) {
        await setPostCategory(this.prisma, bigintId, data.category);
      }
      return this.findById(id);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return false;
    const result = await this.prisma.posts.deleteMany({ where: { id: bigintId, post_type: 'NEWS' } });
    return result.count > 0;
  }

  private toEntity(row: PostRow): NewsEntity {
    const entity = new NewsEntity();
    entity.id = row.id.toString();
    entity.slug = row.slug;
    entity.title = row.title;
    entity.summary = row.excerpt ?? '';
    entity.content = row.content ?? '';
    entity.category = readCategory(row);
    entity.coverImageUrl = row.cover_image_url;
    entity.coverImageFileId = row.featured_image_file_id?.toString() ?? null;
    entity.status = toAppStatus(row.status);
    entity.publishedAt = row.published_at;
    entity.createdAt = row.created_at ?? new Date(0);
    entity.updatedAt = row.updated_at ?? new Date(0);
    entity.subtitle = row.subtitle ?? null;
    entity.imageAlt = row.image_alt ?? null;
    entity.contentBlocks = readContentBlocks(row.content_blocks);
    entity.seoTitle = row.seo_title ?? null;
    entity.seoDescription = row.seo_description ?? null;
    entity.isFeatured = row.is_featured ?? false;
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
