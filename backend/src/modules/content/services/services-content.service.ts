import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SERVICE_REPOSITORY, ServiceRepository } from './repositories/service.repository.interface';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceEntity } from './entities/service.entity';
import { AuditService } from '../../audit/audit.service';
import { MediaService } from '../../media/media.service';
import { MediaImage, MediaRefDto } from '../../media/media.types';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

type Actor = Pick<RequestUser, 'id' | 'email'>;

/** Nombrado `ServicesContentService` para no chocar con el `services.` del catálogo de permisos. */
@Injectable()
export class ServicesContentService {
  constructor(
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository,
    private readonly auditService: AuditService,
    private readonly mediaService: MediaService,
  ) {}

  async findAll(): Promise<ServiceEntity[]> {
    return this.withImages(await this.serviceRepository.findAll());
  }

  async findOne(id: string): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }
    const [withImages] = await this.withImages([service]);
    return withImages;
  }

  /** Para el sitio público: solo servicios publicados (`is_active`), por su slug real (`catalog.services.code`). */
  async findPublishedBySlug(slug: string): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findBySlug(slug);
    if (!service || service.status !== 'PUBLISHED') {
      throw new NotFoundException(`No existe un servicio publicado con el slug ${slug}`);
    }
    const [withImages] = await this.withImages([service]);
    return withImages;
  }

  async create(dto: CreateServiceDto, actor: Actor): Promise<ServiceEntity> {
    const existing = await this.serviceRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException('Ya existe un servicio con ese slug');
    }
    const image = await this.mediaService.resolvePrimary(dto.imageFileId);
    if (dto.galleryImages) await this.mediaService.resolveRefs(dto.galleryImages);

    const created = await this.serviceRepository.create({
      slug: dto.slug,
      name: dto.name,
      shortDescription: dto.shortDescription,
      description: dto.description,
      icon: dto.icon ?? null,
      order: dto.order ?? 0,
      status: dto.status ?? 'DRAFT',
      imageUrl: image?.url ?? null,
      imageAlt: dto.imageAlt ?? null,
    });
    await this.syncImages(created.id, image, dto.imageAlt ?? null, dto.galleryImages, actor);
    this.auditService.log(actor.email, 'services.create', `Servicio creado: ${created.name}`);
    return this.findOne(created.id);
  }

  async update(id: string, dto: UpdateServiceDto, actor: Actor): Promise<ServiceEntity> {
    const existing = await this.findOne(id);
    const { imageFileId, galleryImages, ...fields } = dto;
    const image = await this.mediaService.resolvePrimary(imageFileId);
    if (galleryImages) await this.mediaService.resolveRefs(galleryImages);

    const updated = await this.serviceRepository.update(id, {
      ...fields,
      ...(image !== undefined && { imageUrl: image?.url ?? null }),
    });
    if (!updated) {
      throw new NotFoundException('Servicio no encontrado');
    }
    await this.syncImages(id, image, dto.imageAlt ?? existing.imageAlt, galleryImages, actor);
    this.auditService.log(actor.email, 'services.update', `Servicio actualizado: ${updated.name}`);
    return this.findOne(id);
  }

  /**
   * El borrado de servicios es lógico (`is_active=false`, ver repositorio):
   * el servicio puede reactivarse, así que sus imágenes se conservan.
   */
  async remove(id: string, actor: Actor): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.delete(id);
    this.auditService.log(actor.email, 'services.delete', `Servicio eliminado: ${service.name}`);
  }

  private async syncImages(
    id: string,
    image: MediaImage | null | undefined,
    imageAlt: string | null,
    gallery: MediaRefDto[] | undefined,
    actor: Actor,
  ): Promise<void> {
    if (image !== undefined) {
      await this.mediaService.setSlot('services', id, 'cover', image ? [{ fileId: image.fileId, alt: imageAlt ?? undefined }] : [], actor);
    }
    if (gallery !== undefined) {
      await this.mediaService.setSlot('services', id, 'gallery', gallery, actor);
    }
  }

  private async withImages(items: ServiceEntity[]): Promise<ServiceEntity[]> {
    const images = await this.mediaService.loadForEntities(
      'services',
      items.map((item) => item.id),
    );
    for (const item of items) {
      const slots = images.get(item.id);
      item.imageFileId = slots?.cover?.[0]?.fileId ?? null;
      item.gallery = slots?.gallery ?? [];
    }
    return items;
  }
}
