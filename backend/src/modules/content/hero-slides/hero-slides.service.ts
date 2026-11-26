import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HERO_SLIDE_REPOSITORY, HeroSlideRepository } from './repositories/hero-slide.repository.interface';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';
import { HeroSlideEntity } from './entities/hero-slide.entity';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class HeroSlidesService {
  constructor(
    @Inject(HERO_SLIDE_REPOSITORY) private readonly heroSlideRepository: HeroSlideRepository,
    private readonly auditService: AuditService,
  ) {}

  findAll(): Promise<HeroSlideEntity[]> {
    return this.heroSlideRepository.findAll();
  }

  async findOne(id: string): Promise<HeroSlideEntity> {
    const slide = await this.heroSlideRepository.findById(id);
    if (!slide) {
      throw new NotFoundException('Slide del carrusel no encontrado');
    }
    return slide;
  }

  async create(dto: CreateHeroSlideDto, actorEmail: string): Promise<HeroSlideEntity> {
    const existing = await this.heroSlideRepository.findAll();
    if (existing.some((s) => s.slug === dto.slug)) {
      throw new ConflictException(`Ya existe un slide con slug "${dto.slug}"`);
    }

    const created = await this.heroSlideRepository.create({
      slug: dto.slug,
      serviceCode: dto.serviceCode ?? null,
      nameWhite: dto.nameWhite,
      nameBlue: dto.nameBlue,
      title: dto.title,
      description: dto.description ?? null,
      imageUrl: dto.imageUrl ?? null,
      imagePosition: dto.imagePosition ?? null,
      href: dto.href,
      items: dto.items ?? [],
      order: dto.order ?? 1,
      isActive: dto.isActive ?? true,
    });
    this.auditService.log(actorEmail, 'hero_slides.create', `Slide de Home creado: ${created.title}`);
    return created;
  }

  async update(id: string, dto: UpdateHeroSlideDto, actorEmail: string): Promise<HeroSlideEntity> {
    await this.findOne(id);
    const updated = await this.heroSlideRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Slide del carrusel no encontrado');
    }
    this.auditService.log(actorEmail, 'hero_slides.update', `Slide de Home actualizado: ${updated.title}`);
    return updated;
  }

  async remove(id: string, actorEmail: string): Promise<void> {
    const slide = await this.findOne(id);
    await this.heroSlideRepository.delete(id);
    this.auditService.log(actorEmail, 'hero_slides.delete', `Slide de Home eliminado: ${slide.title}`);
  }
}
