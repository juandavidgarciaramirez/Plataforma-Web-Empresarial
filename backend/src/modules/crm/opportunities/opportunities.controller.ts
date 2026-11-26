import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { ChangeStageDto } from './dto/change-stage.dto';
import { CloseOpportunityDto } from './dto/close-opportunity.dto';
import { AssignOpportunityDto } from './dto/assign-opportunity.dto';
import { OPPORTUNITY_STAGES, OpportunityStage } from './entities/opportunity.entity';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('CRM - Oportunidades')
@ApiBearerAuth()
@Controller('crm/opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  @Permissions('crm.opportunities.read')
  @ApiQuery({ name: 'stage', enum: OPPORTUNITY_STAGES, required: false })
  @ApiOperation({ summary: 'Listar oportunidades (opcionalmente filtradas por etapa)' })
  findAll(@Query('stage') stage?: OpportunityStage) {
    return this.opportunitiesService.findAll(stage);
  }

  @Get(':id')
  @Permissions('crm.opportunities.read')
  @ApiOperation({ summary: 'Obtener una oportunidad por id' })
  findOne(@Param('id') id: string) {
    return this.opportunitiesService.findOne(id);
  }

  @Post()
  @Permissions('crm.opportunities.create')
  @ApiOperation({ summary: 'Crear una oportunidad' })
  create(@Body() dto: CreateOpportunityDto, @CurrentUser() user: RequestUser) {
    return this.opportunitiesService.create(dto, user.email);
  }

  @Patch(':id')
  @Permissions('crm.opportunities.update')
  @ApiOperation({ summary: 'Actualizar una oportunidad' })
  update(@Param('id') id: string, @Body() dto: UpdateOpportunityDto, @CurrentUser() user: RequestUser) {
    return this.opportunitiesService.update(id, dto, user.email);
  }

  @Patch(':id/assign')
  @Permissions('crm.opportunities.assign')
  @ApiOperation({ summary: 'Asignar la oportunidad a un usuario comercial' })
  assign(@Param('id') id: string, @Body() dto: AssignOpportunityDto, @CurrentUser() user: RequestUser) {
    return this.opportunitiesService.assign(id, dto.ownerUserId, user.email);
  }

  @Patch(':id/stage')
  @Permissions('crm.opportunities.change_stage')
  @ApiOperation({ summary: 'Mover la oportunidad a otra etapa del pipeline' })
  changeStage(@Param('id') id: string, @Body() dto: ChangeStageDto, @CurrentUser() user: RequestUser) {
    return this.opportunitiesService.changeStage(id, dto.stage, user.email);
  }

  @Post(':id/close')
  @Permissions('crm.opportunities.close')
  @ApiOperation({ summary: 'Cerrar la oportunidad como ganada o perdida' })
  close(@Param('id') id: string, @Body() dto: CloseOpportunityDto, @CurrentUser() user: RequestUser) {
    return this.opportunitiesService.close(id, dto, user.email);
  }

  @Delete(':id')
  @Permissions('crm.opportunities.delete')
  @ApiOperation({ summary: 'Eliminar una oportunidad' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.opportunitiesService.remove(id, user.email);
  }
}
