import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NEWS_REPOSITORY, NewsRepository } from './repositories/news.repository.interface';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsEntity } from './entities/news.entity';
import { AuditService } from '../../audit/audit.service';
import { MediaService } from '../../media/media.service';
import { MediaImage, MediaRefDto } from '../../media/media.types';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

type Actor = Pick<RequestUser, 'id' | 'email'>;

@Injectable()
export class NewsService {
  constructor(
    @Inject(NEWS_REPOSITORY) private readonly newsRepository: NewsRepository,
    private readonly auditService: AuditService,
    private readonly mediaService: MediaService,
  ) {}

  async findAll(): Promise<NewsEntity[]> {
    return this.withImages(await this.newsRepository.findAll());
  }

  async findOne(id: string): Promise<NewsEntity> {
    const news = await this.newsRepository.findById(id);
    if (!news) {
      throw new NotFoundException('Noticia no encontrada');
    }
    const [withImages] = await this.withImages([news]);
    return withImages;
  }

  async create(dto: CreateNewsDto, actor: Actor): Promise<NewsEntity> {
    const existing = await this.newsRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException('Ya existe una noticia con ese slug');
    }
    // Las imágenes se validan antes de crear nada: una referencia inválida no deja la noticia a medias.
    const cover = await this.mediaService.resolvePrimary(dto.coverImageFileId);
    if (dto.galleryImages) await this.mediaService.resolveRefs(dto.galleryImages);

    const status = dto.status ?? 'DRAFT';
    const created = await this.newsRepository.create({
      slug: dto.slug,
      title: dto.title,
      summary: dto.summary,
      content: dto.content,
      category: dto.category ?? null,
      coverImageUrl: cover?.url ?? dto.coverImageUrl ?? null,
      coverImageFileId: cover?.fileId ?? null,
      imageAlt: dto.imageAlt ?? null,
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    });
    await this.syncImages(created.id, cover, dto.imageAlt ?? null, dto.galleryImages, actor);
    this.auditService.log(actor.email, 'news.create', `Noticia creada: ${created.title}`);
    return this.findOne(created.id);
  }

  async update(id: string, dto: UpdateNewsDto, actor: Actor): Promise<NewsEntity> {
    const existing = await this.findOne(id);
    const { coverImageFileId, galleryImages, ...fields } = dto;
    const cover = await this.mediaService.resolvePrimary(coverImageFileId);
    if (galleryImages) await this.mediaService.resolveRefs(galleryImages);

    const becamePublished = dto.status === 'PUBLISHED' && existing.status !== 'PUBLISHED';
    const updated = await this.newsRepository.update(id, {
      ...fields,
      ...(cover !== undefined && { coverImageUrl: cover?.url ?? null, coverImageFileId: cover?.fileId ?? null }),
      ...(becamePublished ? { publishedAt: new Date() } : {}),
    });
    if (!updated) {
      throw new NotFoundException('Noticia no encontrada');
    }
    await this.syncImages(id, cover, dto.imageAlt ?? existing.imageAlt ?? null, galleryImages, actor);
    this.auditService.log(actor.email, 'news.update', `Noticia actualizada: ${updated.title}`);
    return this.findOne(id);
  }

  async remove(id: string, actor: Actor): Promise<void> {
    const news = await this.findOne(id);
    // Las imágenes se sueltan solo si la noticia realmente se eliminó.
    if (await this.newsRepository.delete(id)) await this.mediaService.releaseEntity('news', id, actor.email);
    this.auditService.log(actor.email, 'news.delete', `Noticia eliminada: ${news.title}`);
  }

  private async syncImages(
    id: string,
    cover: MediaImage | null | undefined,
    coverAlt: string | null,
    gallery: MediaRefDto[] | undefined,
    actor: Actor,
  ): Promise<void> {
    if (cover !== undefined) {
      await this.mediaService.setSlot('news', id, 'cover', cover ? [{ fileId: cover.fileId, alt: coverAlt ?? undefined }] : [], actor);
    }
    if (gallery !== undefined) {
      await this.mediaService.setSlot('news', id, 'gallery', gallery, actor);
    }
  }

  private async withImages(items: NewsEntity[]): Promise<NewsEntity[]> {
    const images = await this.mediaService.loadForEntities(
      'news',
      items.map((item) => item.id),
    );
    for (const item of items) {
      item.gallery = images.get(item.id)?.gallery ?? [];
    }
    return items;
  }
}
