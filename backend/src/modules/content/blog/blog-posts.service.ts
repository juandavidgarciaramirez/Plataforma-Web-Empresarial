import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BLOG_POST_REPOSITORY, BlogPostRepository } from './repositories/blog-post.repository.interface';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPostEntity } from './entities/blog-post.entity';
import { AuditService } from '../../audit/audit.service';
import { MediaService } from '../../media/media.service';
import { MediaImage, MediaRefDto } from '../../media/media.types';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

type Actor = Pick<RequestUser, 'id' | 'email'>;

@Injectable()
export class BlogPostsService {
  constructor(
    @Inject(BLOG_POST_REPOSITORY) private readonly blogPostRepository: BlogPostRepository,
    private readonly auditService: AuditService,
    private readonly mediaService: MediaService,
  ) {}

  async findAll(): Promise<BlogPostEntity[]> {
    return this.withImages(await this.blogPostRepository.findAll());
  }

  async findOne(id: string): Promise<BlogPostEntity> {
    const post = await this.blogPostRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }
    const [withImages] = await this.withImages([post]);
    return withImages;
  }

  async create(dto: CreateBlogPostDto, actor: Actor): Promise<BlogPostEntity> {
    const existing = await this.blogPostRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException('Ya existe una publicación con ese slug');
    }
    // Las imágenes se validan antes de crear nada: una referencia inválida no deja la publicación a medias.
    const cover = await this.mediaService.resolvePrimary(dto.coverImageFileId);
    if (dto.galleryImages) await this.mediaService.resolveRefs(dto.galleryImages);

    const status = dto.status ?? 'DRAFT';
    const created = await this.blogPostRepository.create({
      slug: dto.slug,
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      author: dto.author ?? null,
      category: dto.category ?? null,
      coverImageUrl: cover?.url ?? dto.coverImageUrl ?? null,
      coverImageFileId: cover?.fileId ?? null,
      imageAlt: dto.imageAlt ?? null,
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    });
    await this.syncImages(created.id, cover, dto.imageAlt ?? null, dto.galleryImages, actor);
    this.auditService.log(actor.email, 'blog.create', `Publicación creada: ${created.title}`);
    return this.findOne(created.id);
  }

  async update(id: string, dto: UpdateBlogPostDto, actor: Actor): Promise<BlogPostEntity> {
    const existing = await this.findOne(id);
    const { coverImageFileId, galleryImages, ...fields } = dto;
    const cover = await this.mediaService.resolvePrimary(coverImageFileId);
    if (galleryImages) await this.mediaService.resolveRefs(galleryImages);

    const becamePublished = dto.status === 'PUBLISHED' && existing.status !== 'PUBLISHED';
    const updated = await this.blogPostRepository.update(id, {
      ...fields,
      ...(cover !== undefined && { coverImageUrl: cover?.url ?? null, coverImageFileId: cover?.fileId ?? null }),
      ...(becamePublished ? { publishedAt: new Date() } : {}),
    });
    if (!updated) {
      throw new NotFoundException('Publicación no encontrada');
    }
    await this.syncImages(id, cover, dto.imageAlt ?? existing.imageAlt ?? null, galleryImages, actor);
    this.auditService.log(actor.email, 'blog.update', `Publicación actualizada: ${updated.title}`);
    return this.findOne(id);
  }

  async remove(id: string, actor: Actor): Promise<void> {
    const post = await this.findOne(id);
    // Las imágenes se sueltan solo si la publicación realmente se eliminó.
    if (await this.blogPostRepository.delete(id)) await this.mediaService.releaseEntity('blog', id, actor.email);
    this.auditService.log(actor.email, 'blog.delete', `Publicación eliminada: ${post.title}`);
  }

  private async syncImages(
    id: string,
    cover: MediaImage | null | undefined,
    coverAlt: string | null,
    gallery: MediaRefDto[] | undefined,
    actor: Actor,
  ): Promise<void> {
    if (cover !== undefined) {
      await this.mediaService.setSlot('blog', id, 'cover', cover ? [{ fileId: cover.fileId, alt: coverAlt ?? undefined }] : [], actor);
    }
    if (gallery !== undefined) {
      await this.mediaService.setSlot('blog', id, 'gallery', gallery, actor);
    }
  }

  private async withImages(items: BlogPostEntity[]): Promise<BlogPostEntity[]> {
    const images = await this.mediaService.loadForEntities(
      'blog',
      items.map((item) => item.id),
    );
    for (const item of items) {
      item.gallery = images.get(item.id)?.gallery ?? [];
    }
    return items;
  }
}
