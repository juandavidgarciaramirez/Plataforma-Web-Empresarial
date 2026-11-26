import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  WHO_WE_ARE_CONCEPT_REPOSITORY,
  WhoWeAreConceptRepository,
} from './repositories/who-we-are-concept.repository.interface';
import { CreateWhoWeAreConceptDto } from './dto/create-who-we-are-concept.dto';
import { UpdateWhoWeAreConceptDto } from './dto/update-who-we-are-concept.dto';
import { WhoWeAreConceptEntity } from './entities/who-we-are-concept.entity';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class WhoWeAreConceptsService {
  constructor(
    @Inject(WHO_WE_ARE_CONCEPT_REPOSITORY) private readonly repository: WhoWeAreConceptRepository,
    private readonly auditService: AuditService,
  ) {}

  findAll(): Promise<WhoWeAreConceptEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<WhoWeAreConceptEntity> {
    const concept = await this.repository.findById(id);
    if (!concept) {
      throw new NotFoundException('Concepto de Quiénes somos no encontrado');
    }
    return concept;
  }

  async create(dto: CreateWhoWeAreConceptDto, actorEmail: string): Promise<WhoWeAreConceptEntity> {
    const existing = await this.repository.findAll();
    if (existing.some((c) => c.key === dto.key)) {
      throw new ConflictException(`Ya existe un concepto con key "${dto.key}"`);
    }

    const created = await this.repository.create({
      key: dto.key,
      label: dto.label,
      description: dto.description ?? null,
      order: dto.order ?? 1,
      isActive: dto.isActive ?? true,
    });
    this.auditService.log(actorEmail, 'who_we_are_concepts.create', `Concepto creado: ${created.label}`);
    return created;
  }

  async update(id: string, dto: UpdateWhoWeAreConceptDto, actorEmail: string): Promise<WhoWeAreConceptEntity> {
    await this.findOne(id);
    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Concepto de Quiénes somos no encontrado');
    }
    this.auditService.log(actorEmail, 'who_we_are_concepts.update', `Concepto actualizado: ${updated.label}`);
    return updated;
  }

  async remove(id: string, actorEmail: string): Promise<void> {
    const concept = await this.findOne(id);
    await this.repository.delete(id);
    this.auditService.log(actorEmail, 'who_we_are_concepts.delete', `Concepto eliminado: ${concept.label}`);
  }
}
