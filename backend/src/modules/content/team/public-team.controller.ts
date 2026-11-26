import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeamMembersService } from './team-members.service';
import { Public } from '../../../common/decorators/public.decorator';

/**
 * Lectura pública del equipo / Organigrama (sección 18 del encargo). Antes
 * el sitio leía `src/data/team.ts` (estático). El frontend arma la
 * jerarquía visual a partir de `orgLevel` + `parentId` + `connectorCurve` de
 * cada integrante, igual que antes hacía con el arreglo `orgEdges` estático.
 */
@ApiTags('Contenido - Equipo (público)')
@Controller('public/team')
export class PublicTeamController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar integrantes activos del equipo (público)' })
  async findAll() {
    const members = await this.teamMembersService.findAll();
    return members.filter((member) => member.status === 'ACTIVE');
  }
}
