import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NOTIFICATION_REPOSITORY } from './repositories/notification.repository.interface';
import { PrismaNotificationRepository } from './repositories/prisma-notification.repository';

/** Global: cualquier módulo puede inyectar NotificationsService para avisarle a un usuario, sin importarlo explícitamente. */
@Global()
@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    { provide: NOTIFICATION_REPOSITORY, useClass: PrismaNotificationRepository },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
