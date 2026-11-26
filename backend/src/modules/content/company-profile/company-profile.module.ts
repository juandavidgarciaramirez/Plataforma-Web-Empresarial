import { Module } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';
import { CompanyProfileController } from './company-profile.controller';
import { PublicCompanyProfileController } from './public-company-profile.controller';
import { COMPANY_PROFILE_REPOSITORY } from './repositories/company-profile.repository.interface';
import { PrismaCompanyProfileRepository } from './repositories/prisma-company-profile.repository';

@Module({
  controllers: [CompanyProfileController, PublicCompanyProfileController],
  providers: [
    CompanyProfileService,
    { provide: COMPANY_PROFILE_REPOSITORY, useClass: PrismaCompanyProfileRepository },
  ],
  exports: [CompanyProfileService],
})
export class CompanyProfileModule {}
