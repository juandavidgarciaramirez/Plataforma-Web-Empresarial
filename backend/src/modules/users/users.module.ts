import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [UsersController],
  providers: [UsersService, { provide: USER_REPOSITORY, useClass: PrismaUserRepository }],
  exports: [UsersService, USER_REPOSITORY],
})
export class UsersModule {}
