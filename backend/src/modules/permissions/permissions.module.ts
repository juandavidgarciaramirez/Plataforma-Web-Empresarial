import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PERMISSION_REPOSITORY } from './repositories/permission.repository.interface';
import { PrismaPermissionRepository } from './repositories/prisma-permission.repository';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    { provide: PERMISSION_REPOSITORY, useClass: PrismaPermissionRepository },
  ],
  exports: [PermissionsService, PERMISSION_REPOSITORY],
})
export class PermissionsModule {}
