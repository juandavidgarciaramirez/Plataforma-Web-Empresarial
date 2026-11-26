import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServicesContentService } from './services-content.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('Contenido - Servicios')
@ApiBearerAuth()
@Controller('services')
export class ServicesContentController {
  constructor(private readonly servicesService: ServicesContentService) {}

  @Get()
  @Permissions('cms.services.read')
  @ApiOperation({ summary: 'Listar servicios' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @Permissions('cms.services.read')
  @ApiOperation({ summary: 'Obtener un servicio por id' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @Permissions('cms.services.create')
  @ApiOperation({ summary: 'Crear un servicio' })
  create(@Body() dto: CreateServiceDto, @CurrentUser() user: RequestUser) {
    return this.servicesService.create(dto, user);
  }

  @Patch(':id')
  @Permissions('cms.services.update')
  @ApiOperation({ summary: 'Actualizar un servicio' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto, @CurrentUser() user: RequestUser) {
    return this.servicesService.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions('cms.services.delete')
  @ApiOperation({ summary: 'Eliminar un servicio' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.servicesService.remove(id, user);
  }
}
