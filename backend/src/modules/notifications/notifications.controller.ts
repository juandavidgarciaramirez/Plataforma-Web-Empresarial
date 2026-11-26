import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces/authenticated-request.interface';

/** Cada usuario ve y gestiona solo sus propias notificaciones — sin permission_key, cualquier usuario autenticado. */
@ApiTags('Notificaciones')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiQuery({ name: 'unread', required: false, type: Boolean })
  @ApiOperation({ summary: 'Listar mis notificaciones' })
  findMine(@CurrentUser() user: RequestUser, @Query('unread') unread?: string) {
    return this.notificationsService.findMine(user.id, unread === 'true');
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Contar mis notificaciones sin leer' })
  async countUnread(@CurrentUser() user: RequestUser) {
    return { count: await this.notificationsService.countUnread(user.id) };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar una notificación mía como leída' })
  markRead(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.notificationsService.markRead(id, user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Marcar todas mis notificaciones como leídas' })
  markAllRead(@CurrentUser() user: RequestUser) {
    return this.notificationsService.markAllRead(user.id);
  }
}
