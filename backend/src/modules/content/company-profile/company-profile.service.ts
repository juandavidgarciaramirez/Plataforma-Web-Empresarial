import { Inject, Injectable } from '@nestjs/common';
import {
  COMPANY_PROFILE_REPOSITORY,
  CompanyProfileRepository,
} from './repositories/company-profile.repository.interface';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { CompanyProfileEntity } from './entities/company-profile.entity';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class CompanyProfileService {
  constructor(
    @Inject(COMPANY_PROFILE_REPOSITORY) private readonly companyProfileRepository: CompanyProfileRepository,
    private readonly auditService: AuditService,
  ) {}

  get(): Promise<CompanyProfileEntity> {
    return this.companyProfileRepository.get();
  }

  async update(dto: UpdateCompanyProfileDto, actorEmail: string): Promise<CompanyProfileEntity> {
    const updated = await this.companyProfileRepository.update(dto);
    this.auditService.log(actorEmail, 'company_profile.update', 'Contenido institucional de Home/Nosotros actualizado');
    return updated;
  }
}
