import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { BlogPostEntity } from '../entities/blog-post.entity';
import { BlogPostRepository } from './blog-post.repository.interface';
import {
  POST_INCLUDE,
  PostRow,
  readCategory,
  readContentBlocks,
  readStringArray,
  setPostCategory,
  toAppStatus,
  toBigIntOrNull,
} from '../../common/prisma-post.util';

/**
 * Implementación real sobre `content.posts` (Etapa 5, jud_platform_dev),
 * filtrando `post_type = 'BLOG'`. Noticias usa la misma tabla con
 * `post_type = 'NEWS'` (ver `PrismaNewsRepository`) — es el mismo shape
 * real, no hacía falta una tabla paralela.
 */
@Injectable()
export class PrismaBlogPostRepository implements BlogPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<BlogPostEntity[]> {
    const rows = await this.prisma.posts.findMany({
      where: { post_type: 'BLOG' },
      include: POST_INCLUDE,
      orderBy: { created_at: 'desc' },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<BlogPostEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.posts.findFirst({ where: { id: bigintId, post_type: 'BLOG' }, include: POST_INCLUDE });
    return row ? this.toEntity(row) : null;
  }

  async findBySlug(slug: string): Promise<BlogPostEntity | null> {
    const row = await this.prisma.posts.findFirst({ where: { slug, post_type: 'BLOG' }, include: POST_INCLUDE });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<BlogPostEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPostEntity> {
    const created = await this.prisma.posts.create({
      data: {
        post_type: 'BLOG',
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author_name: data.author,
        cover_image_url: data.coverImageUrl,
        featured_image_file_id: toBigIntOrNull(data.coverImageFileId),
        image_alt: data.imageAlt ?? null,
        status: data.status,
        published_at: data.publishedAt,
      },
    });
    await setPostCategory(this.prisma, created.id, data.category);
    return this.findById(created.id.toString()) as Promise<BlogPostEntity>;
  }

  async update(
    id: string,
    data: Partial<Omit<BlogPostEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<BlogPostEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      await this.prisma.posts.update({
        where: { id: bigintId },
        data: {
          ...(data.slug !== undefined && { slug: data.slug }),
          ...(data.title !== undefined && { title: data.title }),
          ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
          ...(data.content !== undefined && { content: data.content }),
          ...(data.author !== undefined && { author_name: data.author }),
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

    const result = await this.prisma.posts.deleteMany({ where: { id: bigintId, post_type: 'BLOG' } });
    return result.count > 0;
  }

  private toEntity(row: PostRow): BlogPostEntity {
    const entity = new BlogPostEntity();
    entity.id = row.id.toString();
    entity.slug = row.slug;
    entity.title = row.title;
    entity.excerpt = row.excerpt ?? '';
    entity.content = row.content ?? '';
    entity.author = row.author_name;
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
    entity.conclusion = readStringArray(row.conclusion);
    entity.ctaLabel = row.cta_label ?? null;
    entity.ctaHref = row.cta_href ?? null;
    entity.seoTitle = row.seo_title ?? null;
    entity.seoDescription = row.seo_description ?? null;
    entity.authorRole = row.author_role ?? null;
    entity.authorImageUrl = row.author_image_url ?? null;
    entity.tags = readStringArray(row.tags);
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
