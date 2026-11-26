import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TASK_REPOSITORY } from './repositories/task.repository.interface';
import { PrismaTaskRepository } from './repositories/prisma-task.repository';

@Module({
  controllers: [TasksController],
  providers: [TasksService, { provide: TASK_REPOSITORY, useClass: PrismaTaskRepository }],
  exports: [TasksService],
})
export class TasksModule {}
