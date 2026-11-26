import { Module } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';
import { OPPORTUNITY_REPOSITORY } from './repositories/opportunity.repository.interface';
import { PrismaOpportunityRepository } from './repositories/prisma-opportunity.repository';

@Module({
  controllers: [OpportunitiesController],
  providers: [
    OpportunitiesService,
    { provide: OPPORTUNITY_REPOSITORY, useClass: PrismaOpportunityRepository },
  ],
  exports: [OpportunitiesService],
})
export class OpportunitiesModule {}
