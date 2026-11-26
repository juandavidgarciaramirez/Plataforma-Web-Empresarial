import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WhoWeAreConceptsService } from './who-we-are-concepts.service';
import { CreateWhoWeAreConceptDto } from './dto/create-who-we-are-concept.dto';
import { UpdateWhoWeAreConceptDto } from './dto/update-who-we-are-concept.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('Contenido - Quiénes somos')
@ApiBearerAuth()
@Controller('who-we-are-concepts')
export class WhoWeAreConceptsController {
  constructor(private readonly whoWeAreConceptsService: WhoWeAreConceptsService) {}

  @Get()
  @Permissions('cms.concepts.read')
  @ApiOperation({ summary: 'Listar conceptos de Quiénes somos' })
  findAll() {
    return this.whoWeAreConceptsService.findAll();
  }

  @Get(':id')
  @Permissions('cms.concepts.read')
  @ApiOperation({ summary: 'Obtener un concepto por id' })
  findOne(@Param('id') id: string) {
    return this.whoWeAreConceptsService.findOne(id);
  }

  @Post()
  @Permissions('cms.concepts.create')
  @ApiOperation({ summary: 'Crear un concepto de Quiénes somos' })
  create(@Body() dto: CreateWhoWeAreConceptDto, @CurrentUser() user: RequestUser) {
    return this.whoWeAreConceptsService.create(dto, user.email);
  }

  @Patch(':id')
  @Permissions('cms.concepts.update')
  @ApiOperation({ summary: 'Actualizar un concepto de Quiénes somos' })
  update(@Param('id') id: string, @Body() dto: UpdateWhoWeAreConceptDto, @CurrentUser() user: RequestUser) {
    return this.whoWeAreConceptsService.update(id, dto, user.email);
  }

  @Delete(':id')
  @Permissions('cms.concepts.delete')
  @ApiOperation({ summary: 'Eliminar un concepto de Quiénes somos' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.whoWeAreConceptsService.remove(id, user.email);
  }
}
