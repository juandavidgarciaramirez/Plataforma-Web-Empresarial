import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { LEAD_REPOSITORY } from './repositories/lead.repository.interface';
import { PrismaLeadRepository } from './repositories/prisma-lead.repository';
import { OpportunitiesModule } from '../opportunities/opportunities.module';

@Module({
  imports: [OpportunitiesModule],
  controllers: [LeadsController],
  providers: [LeadsService, { provide: LEAD_REPOSITORY, useClass: PrismaLeadRepository }],
  exports: [LeadsService],
})
export class LeadsModule {}
