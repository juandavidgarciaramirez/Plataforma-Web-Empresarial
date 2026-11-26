import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { CrmModule } from '../crm/crm.module';
import { PqrModule } from '../pqr/pqr.module';
import { CareersModule } from '../careers/careers.module';

/**
 * Punto de entrada del panel administrativo. Reutiliza los servicios de
 * users/roles/permissions/audit/crm/pqr/careers (repository pattern) en
 * vez de acceder a persistencia directamente.
 */
@Module({
  imports: [UsersModule, RolesModule, PermissionsModule, CrmModule, PqrModule, CareersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
