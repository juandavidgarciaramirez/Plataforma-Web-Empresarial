import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { COMPANY_REPOSITORY } from './repositories/company.repository.interface';
import { PrismaCompanyRepository } from './repositories/prisma-company.repository';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, { provide: COMPANY_REPOSITORY, useClass: PrismaCompanyRepository }],
  exports: [CompaniesService],
})
export class CompaniesModule {}
