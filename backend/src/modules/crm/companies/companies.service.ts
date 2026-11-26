import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COMPANY_REPOSITORY, CompanyRepository } from './repositories/company.repository.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(COMPANY_REPOSITORY) private readonly companyRepository: CompanyRepository,
    private readonly auditService: AuditService,
  ) {}

  findAll(): Promise<CompanyEntity[]> {
    return this.companyRepository.findAll();
  }

  /** Uso interno (otros servicios CRM): no lanza si no existe. */
  findEntityById(id: string): Promise<CompanyEntity | null> {
    return this.companyRepository.findById(id);
  }

  async findOne(id: string): Promise<CompanyEntity> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }
    return company;
  }

  async create(dto: CreateCompanyDto, actorEmail: string): Promise<CompanyEntity> {
    const created = await this.companyRepository.create({
      name: dto.name,
      taxId: dto.taxId ?? null,
      industry: dto.industry ?? null,
      sizeSegment: dto.sizeSegment ?? null,
      website: dto.website ?? null,
      address: dto.address ?? null,
      phone: dto.phone ?? null,
      ownerUserId: dto.ownerUserId ?? null,
      status: dto.status ?? 'ACTIVE',
    });
    this.auditService.log(actorEmail, 'companies.create', `Empresa creada: ${created.name}`);
    return created;
  }

  async update(id: string, dto: UpdateCompanyDto, actorEmail: string): Promise<CompanyEntity> {
    await this.findOne(id);
    const updated = await this.companyRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Empresa no encontrada');
    }
    this.auditService.log(actorEmail, 'companies.update', `Empresa actualizada: ${updated.name}`);
    return updated;
  }

  async remove(id: string, actorEmail: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companyRepository.delete(id);
    this.auditService.log(actorEmail, 'companies.delete', `Empresa eliminada: ${company.name}`);
  }

  count(): Promise<number> {
    return this.companyRepository.count();
  }
}
