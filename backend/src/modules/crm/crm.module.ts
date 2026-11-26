import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module';
import { ContactsModule } from './contacts/contacts.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { LeadsModule } from './leads/leads.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { TasksModule } from './tasks/tasks.module';
import { ActivitiesModule } from './activities/activities.module';

/**
 * Agrupa todos los módulos del CRM (Admin + CRM v1). Cada submódulo sigue
 * el mismo Repository Pattern en memoria que Users/Roles/Permissions —
 * ver el comentario en cada `in-memory-*.repository.ts`.
 */
@Module({
  imports: [
    CompaniesModule,
    ContactsModule,
    OpportunitiesModule,
    LeadsModule,
    PipelineModule,
    TasksModule,
    ActivitiesModule,
  ],
  exports: [
    CompaniesModule,
    ContactsModule,
    OpportunitiesModule,
    LeadsModule,
    TasksModule,
    ActivitiesModule,
  ],
})
export class CrmModule {}
