import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CreateNotificationData,
  NOTIFICATION_REPOSITORY,
  NotificationRepository,
} from './repositories/notification.repository.interface';
import { NotificationEntity, NotificationType } from './entities/notification.entity';
import { PrismaService } from '../../database/prisma/prisma.service';

/**
 * Notificaciones internas por usuario (Etapa 11, tabla nueva —
 * `foundation.notifications` no existía). Cualquier otro módulo puede
 * inyectar `NotificationsService` y llamar `create()` para avisarle a un
 * usuario (p. ej. "PQR nueva asignada", "Postulación nueva recibida") — no
 * se conectó automáticamente a esos flujos todavía para no arriesgar una
 * regresión; queda como integración de seguimiento.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(NOTIFICATION_REPOSITORY) private readonly notificationRepository: NotificationRepository,
    private readonly prisma: PrismaService,
  ) {}

  findMine(userId: string, onlyUnread = false): Promise<NotificationEntity[]> {
    return this.notificationRepository.findAllForUser(userId, onlyUnread);
  }

  countUnread(userId: string): Promise<number> {
    return this.notificationRepository.countUnread(userId);
  }

  create(data: CreateNotificationData): Promise<NotificationEntity> {
    return this.notificationRepository.create(data);
  }

  markRead(id: string, userId: string): Promise<boolean> {
    return this.notificationRepository.markRead(id, userId);
  }

  markAllRead(userId: string): Promise<number> {
    return this.notificationRepository.markAllRead(userId);
  }

  /**
   * Notifica a todos los usuarios activos cuyo rol tenga `permissionKey`
   * (p. ej. `pqrs.tickets.read` para avisar de una PQR nueva a quien pueda
   * gestionarla). Fire-and-forget desde el punto de llamada: un fallo aquí
   * nunca debe romper el flujo que la origina (radicar una PQR, recibir una
   * postulación, capturar un lead).
   */
  async notifyByPermission(
    permissionKey: string,
    payload: { title: string; message?: string; link?: string; type?: NotificationType },
  ): Promise<void> {
    try {
      const recipients = await this.prisma.$queryRaw<{ id: bigint }[]>`
        SELECT DISTINCT u.id FROM security.users u
        JOIN security.role_permissions rp ON rp.role_id = u.role_id
        JOIN security.permissions p ON p.id = rp.permission_id
        WHERE p.permission_key = ${permissionKey} AND u.status = 'ACTIVE' AND u.deleted_at IS NULL
      `;
      await Promise.all(
        recipients.map((r) =>
          this.create({
            userId: r.id.toString(),
            title: payload.title,
            message: payload.message,
            link: payload.link,
            type: payload.type,
          }),
        ),
      );
    } catch (err) {
      this.logger.error(`No se pudo notificar a los usuarios con permiso "${permissionKey}": ${(err as Error).message}`);
    }
  }
}
