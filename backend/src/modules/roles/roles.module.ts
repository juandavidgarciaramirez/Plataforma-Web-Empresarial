import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { ROLE_REPOSITORY } from './repositories/role.repository.interface';
import { PrismaRoleRepository } from './repositories/prisma-role.repository';

@Module({
  controllers: [RolesController],
  providers: [RolesService, { provide: ROLE_REPOSITORY, useClass: PrismaRoleRepository }],
  exports: [RolesService, ROLE_REPOSITORY],
})
export class RolesModule {}
