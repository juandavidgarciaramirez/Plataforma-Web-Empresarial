import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { ConvertLeadDto } from './dto/convert-lead.dto';
import { CapturePublicLeadDto } from './dto/capture-public-lead.dto';
import { LEAD_SOURCES, LEAD_STATUSES } from './entities/lead.entity';
import { Public } from '../../../common/decorators/public.decorator';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('CRM - Leads')
@ApiBearerAuth()
@Controller('crm/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Public()
  @Post('public')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Captura pública de leads (sección 31: Contacto → CRM). Sin autenticación, fuente forzada a WEBSITE_FORM.',
  })
  capturePublic(@Body() dto: CapturePublicLeadDto) {
    return this.leadsService.captureFromWebForm(dto);
  }

  @Get()
  @Permissions('crm.leads.read')
  @ApiQuery({ name: 'source', enum: LEAD_SOURCES, required: false })
  @ApiQuery({ name: 'status', enum: LEAD_STATUSES, required: false })
  @ApiOperation({ summary: 'Listar leads (filtrable por fuente y estado — p. ej. source=YURI)' })
  findAll(@Query('source') source?: string, @Query('status') status?: string) {
    return this.leadsService.findAll({ source, status });
  }

  @Get(':id')
  @Permissions('crm.leads.read')
  @ApiOperation({ summary: 'Obtener un lead por id' })
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Post()
  @Permissions('crm.leads.create')
  @ApiOperation({ summary: 'Crear un lead' })
  create(@Body() dto: CreateLeadDto, @CurrentUser() user: RequestUser) {
    return this.leadsService.create(dto, user.email);
  }

  @Patch(':id')
  @Permissions('crm.leads.update')
  @ApiOperation({ summary: 'Actualizar un lead' })
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto, @CurrentUser() user: RequestUser) {
    return this.leadsService.update(id, dto, user.email);
  }

  @Patch(':id/assign')
  @Permissions('crm.leads.assign')
  @ApiOperation({ summary: 'Asignar el lead a un usuario comercial' })
  assign(@Param('id') id: string, @Body() dto: AssignLeadDto, @CurrentUser() user: RequestUser) {
    return this.leadsService.assign(id, dto.ownerUserId, user.email);
  }

  @Post(':id/convert')
  @Permissions('crm.leads.convert')
  @ApiOperation({ summary: 'Convertir el lead en una oportunidad' })
  convert(@Param('id') id: string, @Body() dto: ConvertLeadDto, @CurrentUser() user: RequestUser) {
    return this.leadsService.convert(id, dto, user.email);
  }

  @Delete(':id')
  @Permissions('crm.leads.delete')
  @ApiOperation({ summary: 'Eliminar un lead' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.leadsService.remove(id, user.email);
  }
}
