import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OpportunitiesService } from '../opportunities/opportunities.service';
import { Permissions } from '../../../common/decorators/permissions.decorator';

/**
 * El pipeline no es una entidad propia: es una vista de las oportunidades
 * agrupadas por etapa (ver `OpportunitiesService.getPipelineBoard`). Mover
 * una tarjeta de columna reutiliza `PATCH /crm/opportunities/:id/stage`.
 */
@ApiTags('CRM - Pipeline')
@ApiBearerAuth()
@Controller('crm/pipeline')
export class PipelineController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  @Permissions('crm.pipeline.read')
  @ApiOperation({ summary: 'Tablero del pipeline: oportunidades agrupadas por etapa' })
  getBoard() {
    return this.opportunitiesService.getPipelineBoard();
  }
}
