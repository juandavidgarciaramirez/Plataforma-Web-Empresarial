import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces/authenticated-request.interface';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('security.roles.read')
  @ApiOperation({ summary: 'Listar roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions('security.roles.read')
  @ApiOperation({ summary: 'Obtener un rol por id' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Permissions('security.roles.create')
  @ApiOperation({ summary: 'Crear un rol' })
  create(@Body() dto: CreateRoleDto, @CurrentUser() user: RequestUser) {
    return this.rolesService.create(dto, user.email);
  }

  @Patch(':id')
  @Permissions('security.roles.update')
  @ApiOperation({ summary: 'Actualizar un rol' })
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto, @CurrentUser() user: RequestUser) {
    return this.rolesService.update(id, dto, user.email);
  }

  @Delete(':id')
  @Permissions('security.roles.delete')
  @ApiOperation({ summary: 'Eliminar un rol (no aplica a roles del sistema)' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.rolesService.remove(id, user.email);
  }
}
