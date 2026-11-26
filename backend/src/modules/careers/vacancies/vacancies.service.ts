import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VACANCY_REPOSITORY, VacancyRepository } from './repositories/vacancy.repository.interface';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacancyEntity } from './entities/vacancy.entity';
import { AuditService } from '../../audit/audit.service';
import { MediaService } from '../../media/media.service';
import { MediaImage, MediaRefDto } from '../../media/media.types';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

type Actor = Pick<RequestUser, 'id' | 'email'>;

@Injectable()
export class VacanciesService {
  constructor(
    @Inject(VACANCY_REPOSITORY) private readonly vacancyRepository: VacancyRepository,
    private readonly auditService: AuditService,
    private readonly mediaService: MediaService,
  ) {}

  async findAll(): Promise<VacancyEntity[]> {
    return this.withImages(await this.vacancyRepository.findAll());
  }

  async findOne(id: string): Promise<VacancyEntity> {
    const vacancy = await this.vacancyRepository.findById(id);
    if (!vacancy) {
      throw new NotFoundException('Vacante no encontrada');
    }
    const [withImages] = await this.withImages([vacancy]);
    return withImages;
  }

  async create(dto: CreateVacancyDto, actor: Actor): Promise<VacancyEntity> {
    const existing = await this.vacancyRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException('Ya existe una vacante con ese slug');
    }
    const image = await this.mediaService.resolvePrimary(dto.imageFileId);
    if (dto.galleryImages) await this.mediaService.resolveRefs(dto.galleryImages);

    const created = await this.vacancyRepository.create({
      slug: dto.slug,
      title: dto.title,
      department: dto.department ?? null,
      location: dto.location ?? null,
      modality: dto.modality ?? 'ONSITE',
      description: dto.description,
      requirements: dto.requirements ?? null,
      status: dto.status ?? 'OPEN',
      imageUrl: image?.url ?? null,
      imageAlt: dto.imageAlt ?? null,
    });
    await this.syncImages(created.id, image, dto.imageAlt ?? null, dto.galleryImages, actor);
    this.auditService.log(actor.email, 'careers.create', `Vacante creada: ${created.title}`);
    return this.findOne(created.id);
  }

  async update(id: string, dto: UpdateVacancyDto, actor: Actor): Promise<VacancyEntity> {
    const existing = await this.findOne(id);
    const { imageFileId, galleryImages, ...fields } = dto;
    const image = await this.mediaService.resolvePrimary(imageFileId);
    if (galleryImages) await this.mediaService.resolveRefs(galleryImages);

    const updated = await this.vacancyRepository.update(id, {
      ...fields,
      ...(image !== undefined && { imageUrl: image?.url ?? null }),
    });
    if (!updated) {
      throw new NotFoundException('Vacante no encontrada');
    }
    await this.syncImages(id, image, dto.imageAlt ?? existing.imageAlt, galleryImages, actor);
    this.auditService.log(actor.email, 'careers.update', `Vacante actualizada: ${updated.title}`);
    return this.findOne(id);
  }

  async remove(id: string, actor: Actor): Promise<void> {
    const vacancy = await this.findOne(id);
    // Las imágenes se sueltan solo si la vacante realmente se eliminó (p. ej. no la bloquean postulaciones).
    if (await this.vacancyRepository.delete(id)) await this.mediaService.releaseEntity('vacancies', id, actor.email);
    this.auditService.log(actor.email, 'careers.delete', `Vacante eliminada: ${vacancy.title}`);
  }

  private async syncImages(
    id: string,
    image: MediaImage | null | undefined,
    imageAlt: string | null,
    gallery: MediaRefDto[] | undefined,
    actor: Actor,
  ): Promise<void> {
    if (image !== undefined) {
      await this.mediaService.setSlot('vacancies', id, 'cover', image ? [{ fileId: image.fileId, alt: imageAlt ?? undefined }] : [], actor);
    }
    if (gallery !== undefined) {
      await this.mediaService.setSlot('vacancies', id, 'gallery', gallery, actor);
    }
  }

  private async withImages(items: VacancyEntity[]): Promise<VacancyEntity[]> {
    const images = await this.mediaService.loadForEntities(
      'vacancies',
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
