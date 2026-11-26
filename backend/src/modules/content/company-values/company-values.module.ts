import { Module } from '@nestjs/common';
import { CompanyValuesService } from './company-values.service';
import { CompanyValuesController } from './company-values.controller';
import { PublicCompanyValuesController } from './public-company-values.controller';
import { COMPANY_VALUE_REPOSITORY } from './repositories/company-value.repository.interface';
import { PrismaCompanyValueRepository } from './repositories/prisma-company-value.repository';

@Module({
  controllers: [CompanyValuesController, PublicCompanyValuesController],
  providers: [CompanyValuesService, { provide: COMPANY_VALUE_REPOSITORY, useClass: PrismaCompanyValueRepository }],
  exports: [CompanyValuesService],
})
export class CompanyValuesModule {}
