import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { ACTIVITY_REPOSITORY } from './repositories/activity.repository.interface';
import { PrismaActivityRepository } from './repositories/prisma-activity.repository';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, { provide: ACTIVITY_REPOSITORY, useClass: PrismaActivityRepository }],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
