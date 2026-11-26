import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Audit')
@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Permissions('audit.logs.read')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'action', required: false, description: 'Filtra por prefijo, p. ej. "opportunities."' })
  @ApiOperation({ summary: 'Bitácora de auditoría: login/logout, crear/editar/eliminar, asignar, cambios de etapa' })
  findAll(@Query('limit') limit?: string, @Query('action') action?: string) {
    return this.auditService.findAll({ limit: limit ? Number(limit) : undefined, action });
  }
}
