import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('Contenido - Equipo')
@ApiBearerAuth()
@Controller('team')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Get()
  @Permissions('cms.team.read')
  @ApiOperation({ summary: 'Listar integrantes del equipo' })
  findAll() {
    return this.teamMembersService.findAll();
  }

  @Get(':id')
  @Permissions('cms.team.read')
  @ApiOperation({ summary: 'Obtener un integrante por id' })
  findOne(@Param('id') id: string) {
    return this.teamMembersService.findOne(id);
  }

  @Post()
  @Permissions('cms.team.create')
  @ApiOperation({ summary: 'Agregar un integrante al equipo' })
  create(@Body() dto: CreateTeamMemberDto, @CurrentUser() user: RequestUser) {
    return this.teamMembersService.create(dto, user);
  }

  @Patch(':id')
  @Permissions('cms.team.update')
  @ApiOperation({ summary: 'Actualizar un integrante del equipo' })
  update(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto, @CurrentUser() user: RequestUser) {
    return this.teamMembersService.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions('cms.team.delete')
  @ApiOperation({ summary: 'Eliminar un integrante del equipo' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.teamMembersService.remove(id, user);
  }
}
