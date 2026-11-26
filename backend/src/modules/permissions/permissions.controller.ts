import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions('security.roles.read')
  @ApiOperation({ summary: 'Listar el catálogo de permisos' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Permissions('security.roles.read')
  @ApiOperation({ summary: 'Obtener un permiso por id' })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Post()
  @Permissions('security.roles.create')
  @ApiOperation({ summary: 'Crear un permiso (extensión del catálogo)' })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Patch(':id')
  @Permissions('security.roles.update')
  @ApiOperation({ summary: 'Actualizar un permiso' })
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('security.roles.delete')
  @ApiOperation({ summary: 'Eliminar un permiso (si no está en uso por ningún rol)' })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
