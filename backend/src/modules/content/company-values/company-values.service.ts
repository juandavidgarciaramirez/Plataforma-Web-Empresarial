import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COMPANY_VALUE_REPOSITORY, CompanyValueRepository } from './repositories/company-value.repository.interface';
import { CreateCompanyValueDto } from './dto/create-company-value.dto';
import { UpdateCompanyValueDto } from './dto/update-company-value.dto';
import { CompanyValueEntity } from './entities/company-value.entity';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class CompanyValuesService {
  constructor(
    @Inject(COMPANY_VALUE_REPOSITORY) private readonly companyValueRepository: CompanyValueRepository,
    private readonly auditService: AuditService,
  ) {}

  findAll(): Promise<CompanyValueEntity[]> {
    return this.companyValueRepository.findAll();
  }

  async findOne(id: string): Promise<CompanyValueEntity> {
    const value = await this.companyValueRepository.findById(id);
    if (!value) {
      throw new NotFoundException('Valor corporativo no encontrado');
    }
    return value;
  }

  async create(dto: CreateCompanyValueDto, actorEmail: string): Promise<CompanyValueEntity> {
    const existing = await this.companyValueRepository.findAll();
    if (existing.some((v) => v.key === dto.key)) {
      throw new ConflictException(`Ya existe un valor con key "${dto.key}"`);
    }

    const created = await this.companyValueRepository.create({
      key: dto.key,
      title: dto.title,
      description: dto.description ?? null,
      iconKey: dto.iconKey ?? null,
      imageUrl: dto.imageUrl ?? null,
      order: dto.order ?? 1,
      isActive: dto.isActive ?? true,
    });
    this.auditService.log(actorEmail, 'company_values.create', `Valor corporativo creado: ${created.title}`);
    return created;
  }

  async update(id: string, dto: UpdateCompanyValueDto, actorEmail: string): Promise<CompanyValueEntity> {
    await this.findOne(id);
    const updated = await this.companyValueRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Valor corporativo no encontrado');
    }
    this.auditService.log(actorEmail, 'company_values.update', `Valor corporativo actualizado: ${updated.title}`);
    return updated;
  }

  async remove(id: string, actorEmail: string): Promise<void> {
    const value = await this.findOne(id);
    await this.companyValueRepository.delete(id);
    this.auditService.log(actorEmail, 'company_values.delete', `Valor corporativo eliminado: ${value.title}`);
  }
}
